const express = require('express');
const bodyParser = require('body-parser');


var {User} = require('./../models/user');
var {Vote} = require('./../models/vote');
var {Element} = require('./../models/element');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
var votes_route = express.Router();


votes_route.get('/', (req, res) => {
res.render('finduservote', {
    title: 'Select User Vote',
    show_menu: false
});
});


votes_route.post('/', (req, res) => {
if(req.body.Find === 'Findvote') {
Vote.findOne({shortid: req.body.voteshortid}).then((uservote) => {
if(!uservote){
    res.render('finduservote', {
    title: 'Select User Vote',
    show_menu: false,
    message: 'Vote not found'
});
} else {
    res.send(`Vote title: ${uservote.title}`);
};
}, (err) => {
    res.redirect('/votes');
});
};

if(req.body.SelectVote === 'SelectVote'){
Vote.findOne({_id: req.body.selectuservote}).then((uservote) => {
    if(uservote){
    res.send(uservote.title);
    } else {
        res.redirect('/votes');
    }
}, (err) => {
    res.redirect('/votes');
});
};
});

votes_route.post('/ajaxuser', (req, res) => {
    User.findOne({email: req.body.email}).then((user) => {
        if(user){
            return Vote.find({userid: user._id});
        } else {
           res.json({error: 'nouser'});
        }
    }).then((votes) => {
        if(votes.length===0){
            res.json({error: 'novote'});
        } else {
            res.json(votes);
        }
    }).catch((err) => {
        res.json({error: err});
    });
});

votes_route.get('/:voteshort', (req, res) => {

Vote.findOne({shortid: req.params.voteshort}).then((uservote) => {
    
    if(uservote){
    return Element.find({voteform: uservote._id}).sort({elemnum: 1});
    } else {
        res.redirect('/votes');
    }
}).then((elements) => {

    res.render('dovote', {
    title: 'Do the Vote',
    show_menu: false,
    elements: elements
});

}).catch((err) => {
    res.redirect('/votes');
});
});

votes_route.post('/dovote', (req, res) => {
    res.send(req.body);
});




module.exports = {votes_route};