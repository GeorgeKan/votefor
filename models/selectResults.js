const mongoose = require('mongoose');

var selectResultsSchema = mongoose.Schema({
    forelementid: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Element' 
    },
    selectvalue: {
        type: String
    },
    selectsum: {
        type: Number
    }
});

var selectResults = mongoose.model('selectResult', selectResultsSchema);

module.exports = {selectResults};