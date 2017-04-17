const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {User} = require('./../models/user');
var {Vote} = require('./../models/vote');
var {Element} = require('./../models/element');
var {textResults} = require('./../models/textResults');
var {checkResults} = require('./../models/checkResults');
var {selectResults} = require('./../models/selectResults');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
var votes_route = express.Router();


votes_route.get('/', (req, res) => {
res.render('finduservote', {
    title: 'Select User Vote',
    show_menu: false,
    dovotemenu: true
});
});

votes_route.post('/', (req, res) => {
if(req.body.Find === 'Findvote') {
Vote.findOne({shortid: req.body.voteshortid}).then((uservote) => {
if(!uservote){
    res.render('finduservote', {
    title: 'Select User Vote',
    show_menu: false,
    dovotemenu: true,
    message: 'Vote not found'
});
} else {
   return Element.find({voteform: uservote._id}).sort({elemnum: 1});
};
}).then((elements) => {
    res.render('dovote', {
    title: 'Do the Vote',
    show_menu: false,
    elements: elements,
    voteid: elements[0].voteform
});

}).catch((err) => {
    res.redirect('/votes');
});
};

if(req.body.SelectVote === 'SelectVote'){
Vote.findOne({_id: req.body.selectuservote}).then((uservote) => {
    if(uservote){
    return Element.find({voteform: uservote._id}).sort({elemnum: 1});
    } else {
        res.redirect('/votes');
    }
}).then((elements) => {
    res.render('dovote', {
    title: 'Do the Vote',
    show_menu: false,
    elements: elements,
    voteid: elements[0].voteform
});

}).catch((err) => {
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
    elements: elements,
    voteid: elements[0].voteform
});
}).catch((err) => {
    res.redirect('/votes');
});
});

votes_route.post('/dovote', (req, res) => {
    
    Vote.update({_id: req.body.voteid}, {$inc: {dovotesum: 1}}, (err, results) => {
        if(err) {res.redirect('/votes')};
    });

    Element.find({voteform: req.body.voteid}).then((elements) => {

        _.forEach(elements, (elem) => {
            if(elem.type==='text'){
                var newtext = new textResults({
                    forelementid: elem._id,
                    value: req.body[elem._id]
                });

                newtext.save((err) => {
                    if(err) {res.redirect('/votes')};
                });
            };

            if(elem.type==='checkbox'){
                if(req.body[elem._id]){
                    
                    checkResults.update({forelementid: elem._id}, {$inc: {checkyes: 1}}, (err, results) => {
                         if(err) {res.redirect('/votes')};
                    });
                } else {
                    checkResults.update({forelementid: elem._id}, {$inc: {checkno: 1}}, (err, results) => {
                         if(err) {res.redirect('/votes')};
                    });
                };
            };

            if(elem.type==='select'){

                selectResults.update({forelementid: elem._id, selectvalue: req.body[elem._id]}, {$inc: {selectsum: 1}}, (err, result) => {
                    if(err) {res.redirect('/votes')};
                });
            }

    });
    }).catch((err) => {
        res.redirect('/votes');
    });

     res.render('finduservote', {
    title: 'Select User Vote',
    show_menu: false,
    dovotemenu: true,
    message: 'Your Vote Saved - Select new Vote'
});

});

module.exports = {votes_route};