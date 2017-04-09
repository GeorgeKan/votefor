const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var dbUrl = 'mongodb://127.0.0.1:27017/VoteFor';
mongoose.connect(dbUrl);

mongoose.connection.on('connected', () => {
    console.log('Conected to localhost MongoDB');
});

mongoose.connection.on('disconnected', () => {
    console.log('DisConnected from MongoDb');
});

module.exports = { mongoose };