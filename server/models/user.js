'use strict';

import { bookshelf } from '../../db/db';

let User = bookshelf.Model.extend({
    tableName: 'users',
});
   
module.exports = User;