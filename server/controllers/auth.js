import Joi from 'joi';
import { universalFunctions, bcryptFunction, } from '../utils';
import Boom from 'boom';
import cuid from 'cuid';
import Services from "../services";
import Config from "config";
import responseMessages from "../resources/response.json";
import { deviceType } from "../../appConstants";

import { UserSession, User } from "../models";

module.exports = {
    auth: async (req, res) => {
        try {
            const schema = Joi.object().keys({
                email: Joi.string().trim().email().required(),
                password: Joi.string().required(),
            });

            await universalFunctions.validateRequestPayload(req.body, res, schema);

            let payload = req.body;

            let user = await User.where({
                email: payload.email,
            }).fetch({
                require: false
            });

            if (!user) {
                throw Boom.badRequest(responseMessages.USER_NOT_FOUND);
            }

            user = user.toJSON();



            if (user.isDeleted) {
                throw Boom.badRequest(responseMessages.USER_NOT_FOUND);
            }


            if (!bcryptFunction.compareHash(payload.password, user.password)) {
                throw Boom.badRequest(responseMessages.INVALID_CREDENTIALS);
            }

            let sessionData = {
                userId: user.id,
            }

            let token = await sessionManager(sessionData);



            return universalFunctions.sendSuccess({
                statusCode: 200,
                message: responseMessages.LOGIN_SUCCESSFULLY,
                data: {
                    token: token,
                    user: {
                        id: user.id,
                        email: user.email,
                    }
                }
            }, res);
        } catch (error) {
            return universalFunctions.sendError(error, res);
        }
    },
    me: (req, res) => {
        try {
            return universalFunctions.sendSuccess({
                statusCode: 200,
                message: responseMessages.SUCCESS,
                data: req.user
            }, res);
        } catch (error) {
            return universalFunctions.sendError(error, res);
        }
    }
};


const sessionManager = async (sessionData) => {
    try {

        const defaults = Config.get("sessionManager")
        if (defaults) {
            let tokenExpireTime = Config.get("jwt.tokenExpire");
            tokenExpireTime = defaults.userTokenExpireTime
            return webSessionManager(defaults.webMultiSession, tokenExpireTime, sessionData)


        } else {
            throw Boom.badRequest(responseMessages.DEFAULT)
        }
    } catch (error) {
        throw error
    }
}

const webSessionManager = async (webMultiSession, expireTime, sessionData) => {
    try {
        const dataToSave = {
            userId: sessionData.userId,
            uuid: cuid()
        }

        console.log("dataToSave", dataToSave);
        if (!webMultiSession) {
            const criteria = {
                userId: sessionData.userId,
                deviceType: deviceType.WEB,
            }
            await UserSession.where(criteria).destroy({ require: false })
        }

        const session = await UserSession.forge().save(dataToSave)

        const tokenData = {
            userId: sessionData.userId,
            sessionId: session.id,
            deviceType: sessionData.deviceType,
        }

        return createaccessToken(tokenData, expireTime)
    } catch (error) {
        throw error
    }
}


const createaccessToken = async (tokenData, expireTime) => {
    try {

        const accessToken = await Services.auth.createToken(tokenData, expireTime)
        if (accessToken) {
            return accessToken
        } else {
            throw Boom.badRequest(responseMessages.DEFAULT)
        }
    } catch (error) {
        throw error
    }
}
