const mongoose = require('mongoose');

var checkResultsSchema = mongoose.Schema({
    forelementid: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Element' 
    },
    checkyes: {
        type: Number
    },
    checkno: {
        type: Number
    }
});

var checkResults = mongoose.model('checkResult', checkResultsSchema);

module.exports = {checkResults};