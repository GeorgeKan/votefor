const mongoose = require('mongoose');

var voteSchema = mongoose.Schema({

    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },

    shortid: {
        type: String,
        required: true
    },

    dovotesum: {
        type: Number
    }
    
});

var Vote = mongoose.model('Vote', voteSchema);

module.exports = {Vote};