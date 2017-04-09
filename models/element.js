const mongoose = require('mongoose');

var elementSchema = mongoose.Schema({
type: {
    type: String
},
text: {
    type: String,
    trim: true
},
value: {
    type: String,
    trim: true
},
elemnum: {
    type: Number,
},
voteform: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vote' 
}
});

var Element = mongoose.model('Element', elementSchema);

module.exports = {Element};