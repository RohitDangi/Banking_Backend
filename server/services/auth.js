import Jwt from "jsonwebtoken";
import Config from "config";
import responseMessage from "../resources/response.json";
import {  UserSession, User } from "../models";
import Boom  from "boom";
import Utils from "../utils";
const logger = Utils.logger;

const checkAuth = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.query['x-access-token']
    if (token) {
        Jwt.verify(token, Config.get("jwt.secret"), async function (err, decoded) {
            try {
                if (err) {
                    throw Boom.unauthorized(responseMessage.INVALID_TOKEN)
                } else {
                    logger.info('<<<<<<<<<<<<<<<<<<<<DEVICE>>>>>>>>>>>', decoded)

                    await validateSession(decoded);
                    let user = await User.where({id: decoded.userId}).fetch({ require: false });
                    if(!user) {
                        throw Boom.unauthorized(responseMessage.USER_NOT_FOUND);
                    }

                    user = user.toJSON();

                    if(user.isDeleted) {
                        throw Boom.badRequest(responseMessage.USER_NOT_FOUND);
                    }

                  

                    let userInfo = {
                        id: user.id,
                        email: user.email,
                        currenBalance:user.currenBalance,
                        createdAt: user.createdAt,
                    }

                    req.user = userInfo;
                    next();
                }
            } catch (error) {
                return Utils.universalFunctions.sendError(error, res)
            }
        })
    } else {
        return Utils.universalFunctions.sendError(Boom.forbidden(responseMessage.TOKEN_NOT_PROVIDED), res)
    }
}

const createToken = async (payloadData, time) => {
    const expireTime = {
        expiresIn: time * 60,
    };
    return new Promise((resolve, reject) => {
        Jwt.sign(payloadData, Config.get("jwt.secret"), expireTime, (err, jwt) => {
            if (err) {
                reject(err)
            } else {
                resolve(jwt)
            }
        })
    })
}

const validateSession = async (user) => {
    try {
        const criteria = {
            userId: user.userId,
            id: user.sessionId,
        };
        const session = UserSession.where(criteria).fetch({ require: false });
        if (session) {
            return session;
        }
        else {
            throw Boom.unauthorized(responseMessage.INVALID_TOKEN)
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    checkAuth,
    createToken
}
