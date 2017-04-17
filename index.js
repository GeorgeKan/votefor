const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const _ = require('lodash');

app = express();

const port = process.env.PORT || 3000;

var {selectResults} = require('./models/selectResults');
var {user_router} = require('./routes/user-route');
var {votes_route} = require('./routes/votes_route');
app.use('/', user_router);
app.use('/votes', votes_route);
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

hbs.registerHelper('selectresult', (elem) => {
var selectTag = "<select name='resultselect' id='resultselect'>";
selectTag = selectTag + "<option value='1'>--Select Vote Title--</option>";
        _.forEach(elem, (value) => {
            selectTag = selectTag + "<option value='" + value._id + "'>" + value.title + "</option>"
        });
        selectTag = selectTag + "</select>";
    return new hbs.SafeString(selectTag);        
});

hbs.registerHelper('createelement', (elem) => {
if(elem.type === 'text'){
    return new hbs.SafeString("<p>" + elem.text + " : <input type='text' name='" + elem._id + "' placeholder='" + elem.value + "'></p>");
};
if(elem.type === 'checkbox'){
    return new hbs.SafeString("<p>" + elem.text + " : <input type='checkbox' name='" + elem._id + "' value='" + elem.value + "'></p>");
}
if(elem.type === 'select'){
        var selectTag = elem.text + " : <select name='" + elem._id + "'>";
        _.forEach(elem.values, (value) => {
            selectTag = selectTag + "<option value='" + value + "'>" + value + "</option>"
        });
        selectTag = selectTag + "</select>";   
};
return new hbs.SafeString(selectTag);
});

app.get('/', (req, res) => {
    req.session.destroy();
    res.render('index', {
        title: 'Home page',
        show_menu: true,
        user_menu: false
    });
});


app.listen(port, () => {
    console.log(`Server Up at port ${port}`);
});