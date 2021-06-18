import {  Ledger  } from '../models';
import { universalFunctions } from '../utils';
import responseMessages from "../resources/response.json";

module.exports = {
    getUserLedgerHistory: async (req, res) => {
        try {
            let userId = req.user.id
            let filter = { isDeleted: false };

            let ledgerObj = await Ledger.query(function (qb) {
                qb.where((builder) => {
                    builder.where(filter)
                        .where("userId",userId)
        
                })
            })
            .orderBy('createdAt', 'DESC')
            .fetchAll({
                require: false,
                columns: ["uuid", "transactionType", 'userId','amount','date','description' ,'lastAmount', 'currentAmount',],
            });
          
            ledgerObj = JSON.parse(JSON.stringify(ledgerObj));
            
         

            return universalFunctions.sendSuccess({
                statusCode: 200,
                message: responseMessages.SUCCESS,
                data: ledgerObj
            }, res);

        } catch (error) {
            return universalFunctions.sendError(error, res);
        }
    }
};
