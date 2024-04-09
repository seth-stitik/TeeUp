require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

const pool = new Pool({
    user: 'teeupuser',
    host: 'localhost',
    database: 'teeupdb',
    password: process.env.DB_SECRET,
    port: 5432,
});

module.exports = pool;