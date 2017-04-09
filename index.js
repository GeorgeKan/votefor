const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');

app = express();

const port = process.env.PORT || 3000;

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
    return new hbs.SafeString(elem.text + "<input type='text' name='" + elem._id + "'>");
};
if(elem.type === 'checkbox'){
    return new hbs.SafeString("<input type='checkbox' name='" + elem._id + "' value='" + elem.value + "'>" + elem.value);
}

if(elem.type === 'select'){
    return 'select';
}


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