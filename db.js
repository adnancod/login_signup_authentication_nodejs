const mongoose = require('mongoose');

require('dotenv').config();
mongoose.connect(process.env.ConnectionUrl)

const db = mongoose.connection;

//define event listeners
db.on('connected', () =>
    console.log('Connected to mongodb server')
)
db.on('disconnected', () =>
    console.log('Disconnected to mongodb server')
)
db.on('error', (err) =>
    console.log('Mongodb connection error: ', err)
)
//export the database connection
module.exports = db;