const env = process.env;
const db = {
  client: 'postgres',
  connection: {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    charset: 'utf8',
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
};

const knex = require('knex')(db);
const DB = require('bookshelf')(knex);
DB.plugin(require('bookshelf-schema'));

// create tables
//   script for droppping table
Promise.all([

//   knex.schema.dropTable('users'),
//   knex.schema.dropTable('logs'),
//   knex.schema.dropTable('contacts'),
  
  knex.schema.hasTable('users').then(exists => {
    if (!exists) {
      knex.schema.createTable('users', user => {
        user.increments('id').primary();
        user.string('name');
        user.string('email').unique();
        user.string('password');
        user.string('role').notNullable().defaultTo('client');
        user.string('token');
        user.string('phone');
        user.boolean('verified');
        user.string('sms_code');
        user.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      }).then(table => {
        console.log('Created Table', table);
      });
    }
  }),
  
  knex.schema.hasTable('logs').then(exists => {
    if (!exists) {
      knex.schema.createTable('logs', log => {
        log.increments('id').primary();
        log.integer('user_id');
        log.string('action');
        log.string('action_key');
        log.string('action_data');
        log.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      }).then(table => {
        console.log('Created Table', table);
      });
    }
  }),
  
  knex.schema.hasTable('contacts').then(exists => {
    if (!exists) {
      knex.schema.createTable('contacts', contact => {
        contact.increments('id').primary();
        contact.integer('user_id');
        contact.string('name');
        contact.string('phone');
        contact.string('comment');
        contact.string('gender');
        contact.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      }).then(table => {
        console.log('Created Table', table);
      });
    }
  })
]);

export default DB;
