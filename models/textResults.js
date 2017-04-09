const mongoose = require('mongoose');

var textResultsSchema = mongoose.Schema({
    forelementid: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Element' 
    },
    value: {
        type: String,
        trim: true
    }
});

var textResults = mongoose.model('textResult', textResultsSchema);

module.exports = {textResults};