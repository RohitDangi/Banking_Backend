'use strict';

const appConstants = require("../../appConstants");

exports.up = function(knex) {
    return Promise.all([
     
        // User 
        knex.schema.createTable('users', function(table) {
            table.increments();
            table.uuid('uuid').unique();
            table.string('email').unique();
            table.string('password');

            table.decimal("openingBalance", 38, 5).defaultTo(10000);
            table.decimal("currenBalance", 38, 5).defaultTo(10000);

            table.boolean('isDeleted').defaultTo(false);
            table.dateTime("createdAt").defaultTo(knex.fn.now())
            table.dateTime("updatedAt").defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
          }),
          
          // Session for user
          knex.schema.createTable('usersession', function(table) {
            table.increments();
            table.uuid('uuid').unique();
            table.integer('userId').unsigned().references("id").inTable('users');
            table.enum('deviceType', [appConstants.deviceType.WEB]);
            table.datetime("logoutAt")
            table.dateTime("createdAt").defaultTo(knex.fn.now())
            table.dateTime("updatedAt").defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
        }),
     
    //Ledger
    knex.schema.createTable('ledger', function(table) { 
        table.increments();
        table.uuid('uuid').unique();

        table.integer('userId').unsigned().references('id').inTable('users');
        table.enum('transactionType', [appConstants.transactionTypes.Credit, appConstants.transactionTypes.Debit]);
        table.decimal("amount", 38, 5).defaultTo(0);
        table.dateTime("date")
        table.string('description');
        table.decimal("lastAmount", 38, 5).defaultTo(0);
        table.decimal("currentAmount", 38, 5).defaultTo(0);

        table.boolean('isDeleted').defaultTo(false);
        table.dateTime("createdAt").defaultTo(knex.fn.now())
        table.dateTime("updatedAt").defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    })
 
    ]);
};

exports.down =async function(knex) {
    await knex.schema.dropTable('users');
    await knex.schema.dropTable('usersession');
    await knex.schema.dropTable('ledger');

};
