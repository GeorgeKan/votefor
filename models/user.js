const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({

username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5
},

email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
    lowercase: true
},

password: {
    type: String,
    required: true,
    minlength: 6
}
});

var User = mongoose.model('User', UserSchema);

module.exports = { User };