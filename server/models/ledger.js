'use strict';

import { bookshelf } from '../../db/db';
import User from './user';

let Ledger = bookshelf.Model.extend({
    tableName: 'ledger',
    userId: function () {
        return this.hasOne(User, 'id', 'userId');
    }
});
   
module.exports = Ledger;