'use strict';
import knex from 'knex';
import bookshelf from 'bookshelf';
import config from "config";

let knexInstance = knex(config.get("db"));


let bookshelfInstance = bookshelf(knexInstance);

module.exports.bookshelf = bookshelfInstance;
module.exports.knex = knexInstance;