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

hbs.registerHelper('createelement', (elem) => {

if(elem.type === 'text'){
    return new hbs.SafeString("<p>" + elem.text + " : <input type='text' name='" + elem._id + "' placeholder='" + elem.value + "'></p>");
};


if(elem.type === 'checkbox'){
    return new hbs.SafeString("<p>" + elem.text + " : <input type='checkbox' name='" + elem._id + "' value='" + elem.value + "'></p>");
}

if(elem.type === 'select'){
    
    selectResults.find({forelementid: elem._id}).then((selects) => {
        var selectTag = elem.text + " : <select name='" + elem._id + "'>";
        _.forEach(selects, (value) => {
            selectTag = selectTag + "<option value='" + value.selectvalue + "'>" + value.selectvalue + "</option>"
        });
        selectTag = selectTag + "</select>";
        return 'Select';
    }).catch((err) => {
        return 'error';
    });

};

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