import Joi from 'joi';
import { universalFunctions } from '../utils';
import Boom from 'boom';
import { User, Ledger } from '../models';
import cuid from 'cuid';
import responseMessages from "../resources/response.json";
import moment from 'moment';
const appConstants = require("../../appConstants");
import {
    knex
} from "../../db/db";
import { createHash } from "../utils/bcrypt";
const _ = require('lodash');
module.exports = {
    signup: async (req, res) => {
        try {
            const schema = Joi.object().keys({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
            });

            let payload = req.body;
            await universalFunctions.validateRequestPayload(payload, res, schema);

            payload.password = createHash(payload.password);

            payload.uuid = cuid();

            // check if user exists with same email 
            let userObj = await knex("users").where((builder) => {
                builder.where("email", payload.email);
            });
            userObj = JSON.parse(JSON.stringify(userObj));
            if (userObj.length > 0) {
                return universalFunctions.sendError(responseMessages.DUPLICATE, res);
            }
            // end
            if (!userObj || userObj.length === 0) {
                let userData = await User.forge().save(payload);
                userData = userData.toJSON();

                delete userData.id;
                delete userData.createdAt;
                delete userData.updatedAt;
                delete userData.isDeleted;


                return universalFunctions.sendSuccess(
                    {
                        statusCode: 200,
                        message: responseMessages.SUCCESS,
                        data: userData,
                    },
                    res
                );
            }
        } catch (error) {
            return universalFunctions.sendError(error, res);
        }
    },
    listUser: async (req, res) => {
        try {
            let limit = req.query.limit ? req.query.limit : appConstants.DEFALUT_LIMIT;
            let offset = req.query.offset ? req.query.offset : appConstants.DEFALUT_SKIP;
            console.log("user", req.user);
            let filter = { isDeleted: false };
            let user = await User.query(function (qb) {
                qb.where((builder) => {
                    builder.where(filter);
                    builder.andWhere('id', '<>', req.user.id)
                })
            })
                .orderBy('createdAt', 'DESC')
                .fetchPage({
                    limit: limit,
                    offset: offset,
                    require: false,
                    columns: ["uuid", 'email']
                });
            let exPagnationData = user.pagination;

            user = user ? user.toJSON() : [];


            return universalFunctions.sendSuccess({
                statusCode: 200,
                message: responseMessages.SUCCESS,
                data: {
                    user,
                    pagination: exPagnationData
                }
            }, res);
        } catch (error) {
            return universalFunctions.sendError(error, res);
        }
    },
    transferMoney: async (req, res) => {
        try {
            const schema = Joi.object().keys({
                userId: Joi.string().min(25).max(25).required(),
                amount: Joi.number().integer().min(1),
                description: Joi.string().optional(),
            });

            let payload = req.body;

            await universalFunctions.validateRequestPayload(payload, res, schema);
            if (parseFloat(req.user.currenBalance) < parseFloat(payload.amount)) {
                throw Boom.badRequest(responseMessages.IN_SUFFICIENT_FUND);
            } else {

                let senderEntry = _.cloneDeep(payload);
                let receiverEntry = _.cloneDeep(payload)
                senderEntry.uuid = cuid();
                receiverEntry.uuid = cuid();
                senderEntry.userId = req.user.id;



                senderEntry.lastAmount = parseFloat(req.user.currenBalance) || 0
                senderEntry.currentAmount = parseFloat(req.user.currenBalance) - parseFloat(senderEntry.amount)
                senderEntry.date = moment().format(appConstants.DATE_FORMAT)
                senderEntry.transactionType = appConstants.transactionTypes.Debit



                // payload.senderId = req.user.id;
                let receiver = await knex('users')
                    .where({
                        uuid: payload.userId,
                    });
                if (!receiver || receiver.length === 0) {
                    throw Boom.badRequest(responseMessages.USER_NOT_FOUND);
                }
                receiver = JSON.parse(JSON.stringify(receiver))[0];

                if (receiver) {
                    receiverEntry.userId = receiver.id
                    receiverEntry.lastAmount = parseFloat(receiver.currenBalance) || 0
                    receiverEntry.currentAmount = parseFloat(receiver.currenBalance) + parseFloat(receiverEntry.amount)
                    receiverEntry.date = moment().format(appConstants.DATE_FORMAT)
                    receiverEntry.transactionType = appConstants.transactionTypes.Credit

                }
                console.log("senderEntry", senderEntry,);

                console.log("receiverEntry", receiverEntry);
                await Ledger.forge().save(senderEntry);
                await Ledger.forge().save(receiverEntry);


                let usersToUpdate = [{ id: receiverEntry.userId, currenBalance: receiverEntry.currentAmount }, { id: senderEntry.userId, currenBalance: senderEntry.currentAmount }];
                //  add amount to receiver and deduct from sender logic here

                if (usersToUpdate.length > 0) {
                    usersToUpdate.map(async (p) => {
                        await knex('users').update(p).where('id', p.id)
                    })
                }

                return universalFunctions.sendSuccess({
                    statusCode: 200,
                    message: responseMessages.SUCCESS,
                    data: senderEntry.currentAmount
                }, res);
            }

        } catch (error) {
            return universalFunctions.sendError(error, res);
        }
    }
};
