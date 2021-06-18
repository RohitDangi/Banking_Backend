'use strict';

import { bookshelf } from '../../db/db';


let UserSession = bookshelf.Model.extend({
    tableName: 'usersession',
});
   
module.exports = {
    UserSession
};