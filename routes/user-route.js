const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const _ = require('lodash');

var randomString = require('crypto-random-string');
var md5 = require('md5');
var {User} = require('./../models/user');
var {Vote} = require('./../models/vote');
var {Element} = require('./../models/element');
var {textResults} = require('./../models/textResults');
var {checkResults} =require('./../models/checkResults');
var {selectResults} = require('./../models/selectResults');
var {saveSelectResutls} = require('./utils/saveSelectResutls');
var {authenticate} = require('./../middleware/authenticate');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(session({secret: 'vote-for*secret!', saveUninitialized: true, resave: true, cookie: {maxAge: 60000 * 60}}));
var user_router = express.Router();

user_router.get('/signin', (req, res) => {
    res.render('signin', {
        title: 'Singn In Form',
        show_menu: true,
        user_menu: false
    });
});

user_router.post('/signin', (req, res) => {
    var newuser = new User({
        username: req.body.username,
        email: req.body.email,
        password: md5(req.body.password)
    });
    newuser.save().then((user) => {
        res.render('login', {
        title: 'Login Form',
        show_menu: true,
        user_menu: false,
        trys: 1
         });
    }, (err) => {
        var errormessage='';
        if(err.errmsg.includes('email')) {
            errormessage = 'Email allready exists';
        };
        if(err.errmsg.includes('username')) {
            errormessage = 'Username allready exists';
        };
        res.render('signin', {
        title: 'Singn In Form',
        errormessage
    });
    });
});

user_router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login Form',
        show_menu: true,
        user_menu: false,
        trys: 1
    });
});

user_router.post('/login', (req, res) => {
User.findOne({email: req.body.email, password: md5(req.body.password)}).then((user) => {
if(!user){
    req.body.trys = req.body.trys + '1';
    if(req.body.trys.length<4){
    res.render('login', {
        title: 'Login Form',
        show_menu: true,
        user_menu: false,
        errormessage: 'Email or password do not mutch - Try again',
        trys: req.body.trys
    });} else {
        res.render('index', {
        title: 'Home page',
        show_menu: true,
        user_menu: false
    });
    }
} else {
    req.session.token = user.password;
    res.redirect('/userpanel');
}
}, (err) => {
    res.render('login', {
        title: 'Login Form',
        show_menu: true,
        user_menu: false,
        errormessage: 'Email or password do not mutch - Try again'
    });
});
});

user_router.get('/userpanel', authenticate, (req, res) => {
res.render('userpanel', {
            title: 'User panel',
            username: req.user.username,
            show_menu: true,
            user_menu: true
        });
});

user_router.get('/logout', (req, res) => {
req.session.destroy();
res.redirect('/');
});

user_router.get('/newvote', authenticate, (req, res) => {
    res.render('newvote', {
        title: 'Add new vote',
        username: req.user.username,
        voteshort: randomString(15),
        titleno: true,
        tomenyelements: false,
        newvotemenu: true,
        voteelements: 0
    });
});

user_router.post('/newvote', authenticate, (req, res) => {
if(req.body.Save === 'saveTitle'){
    var countElements = parseInt(req.body.textvoteelements,10);
    if(countElements>14){
        var titleno = true;
        var tomenyelements = true;
    } else {
        var titleno = false;
        var tomenyelements = false;
    };
    Vote.findOneAndUpdate({shortid: req.body.voteshort}, {$set: {title: req.body.votetitle}}, {new: true}).then((vote) => {
        if(vote){
            res.render('newvote', {
                title: 'Add new vote',
                username: req.user.username,
                voteshort: vote.shortid,
                titleno,
                tomenyelements,
                newvotemenu: true,
                votepasstitle: vote.title,
                votepassid: vote._id,
                voteelements: req.body.textvoteelements
            });
        } else {
            var newVote = new Vote({
                userid: req.user._id,
                title: req.body.votetitle,
                shortid : req.body.voteshort
            });
            newVote.save().then((newvote) => {
                res.render('newvote', {
                title: 'Add new vote',
                username: req.user.username,
                voteshort: newvote.shortid,
                titleno,
                tomenyelements,
                newvotemenu: true,
                votepasstitle: newvote.title,
                votepassid: newvote._id,
                voteelements: req.body.textvoteelements
            });
            }, (err) => {
                res.redirect('/logout');
            });
        } 
    }).catch((err) => {
        res.redirect('/logout');
    });
}

if(req.body.Save === 'saveText'){
    var countElements = parseInt(req.body.textvoteelements,10) + 1;
    if(countElements>14){
        var titleno = true;
        var tomenyelements = true;
    } else {
        var titleno = false;
        var tomenyelements = false;
    };
    var newElement = new Element({
        type: 'text',
        text: req.body.texttext,
        value: req.body.textvalue,
        values: [],
        elemnum: countElements,
        voteform: req.body.textvoteid
    });
    newElement.save().then((element) => {
        res.render('newvote', {
                title: 'Add new vote',
                username: req.user.username,
                voteshort: req.body.textshortid,
                titleno,
                tomenyelements,
                newvotemenu: true,
                votepasstitle: req.body.textvotetitle,
                votepassid: req.body.textvoteid,
                voteelements: countElements
            });
    }).catch((err) => {
        res.redirect('/logout');
    });
}

if(req.body.Save === 'saveCheck'){
    var countElements = parseInt(req.body.textvoteelements,10) + 1;
    if(countElements>14){
        var titleno = true;
        var tomenyelements = true;
    } else {
        var titleno = false;
        var tomenyelements = false;
    };
    var newElement = new Element({
        type: 'checkbox',
        text: req.body.checktext,
        value: 'yes',
        values: [],
        elemnum: countElements,
        voteform: req.body.textvoteid
    });
    newElement.save().then((element) => {
        var newcheckResult = new checkResults({
            forelementid: element._id,
            checkyes: 0,
            checkno: 0
        });
        return newcheckResult.save();
    }).then((checkrslt) => {
res.render('newvote', {
                title: 'Add new vote',
                username: req.user.username,
                voteshort: req.body.textshortid,
                titleno,
                tomenyelements,
                newvotemenu: true,
                votepasstitle: req.body.textvotetitle,
                votepassid: req.body.textvoteid,
                voteelements: countElements
            });
    }).catch((err) => {
        res.redirect('/logout');
    });
}

if(req.body.Save === 'saveSelect'){
    var countElements = parseInt(req.body.textvoteelements,10) + 1;
    if(countElements>14){
        var titleno = true;
        var tomenyelements = true;
    } else {
        var titleno = false;
        var tomenyelements = false;
    };
    var newElement = new Element({
        type: 'select',
        text: req.body.selecttext,
        value: '',
        elemnum: countElements,
        voteform: req.body.textvoteid
    });

        newElement.values.push(req.body.selectvalue1);
        newElement.values.push(req.body.selectvalue2);

        if(!req.body.selectvalue3==""){
        newElement.values.push(req.body.selectvalue3);
         };
         if(!req.body.selectvalue4==""){
        newElement.values.push(req.body.selectvalue4);
         };
         if(!req.body.selectvalue5==""){
        newElement.values.push(req.body.selectvalue5);
         };
         if(!req.body.selectvalue6==""){
        newElement.values.push(req.body.selectvalue6);
         };
         if(!req.body.selectvalue7==""){
        newElement.values.push(req.body.selectvalue7);
         };
         if(!req.body.selectvalue8==""){
        newElement.values.push(req.body.selectvalue8);
         };
         if(!req.body.selectvalue9==""){
        newElement.values.push(req.body.selectvalue9);
         };
         if(!req.body.selectvalue10==""){
        newElement.values.push(req.body.selectvalue10);
         };


        newElement.save().then((element) => {
                
        if(!req.body.selectvalue1==""){
        saveSelectResutls(element._id, req.body.selectvalue1);
         };
          if(!req.body.selectvalue2==""){
        saveSelectResutls(element._id, req.body.selectvalue2);
         };
          if(!req.body.selectvalue3==""){
        saveSelectResutls(element._id, req.body.selectvalue3);
         };
          if(!req.body.selectvalue4==""){
        saveSelectResutls(element._id, req.body.selectvalue4);
         };
          if(!req.body.selectvalue5==""){
        saveSelectResutls(element._id, req.body.selectvalue5);
         };
          if(!req.body.selectvalue6==""){
        saveSelectResutls(element._id, req.body.selectvalue6);
         };
          if(!req.body.selectvalue7==""){
        saveSelectResutls(element._id, req.body.selectvalue7);
         };
          if(!req.body.selectvalue8==""){
        saveSelectResutls(element._id, req.body.selectvalue8);
         };
          if(!req.body.selectvalue9==""){
        saveSelectResutls(element._id, req.body.selectvalue9);
         };
          if(!req.body.selectvalue10==""){
        saveSelectResutls(element._id, req.body.selectvalue10);
         };

        res.render('newvote', {
                title: 'Add new vote',
                username: req.user.username,
                voteshort: req.body.textshortid,
                titleno,
                tomenyelements,
                newvotemenu: true,
                votepasstitle: req.body.textvotetitle,
                votepassid: req.body.textvoteid,
                voteelements: countElements
            });    
    }).catch((err) => {
        res.redirect('/logout');
    });
}
});

app.post('/ajaxvote', (req, res) => {
    
    if(req.body.type==='text'){
        Element.find({voteform: req.body.voteid, type: 'text'},'_id text').then((textelems) => {
            res.json({
                textelems
            });
        }).catch((err) => {
            res.json({error: 'error'});
        });
    };

    if(req.body.type==='textresult'){
        textResults.find({forelementid: req.body.textid}).then((txtvalues) => {
            res.json({
                txtvalues
            });
        }).catch((err) => {
            res.json({error: 'error'});
        });
    };

 if(req.body.type==='checkbox'){
        Element.find({voteform: req.body.voteid, type: 'checkbox'},'_id text').then((checkelems) => {
            res.json({
                checkelems
            });
        }).catch((err) => {
            res.json({error: 'error'});
        });
    };

 if(req.body.type==='checkresult'){
        checkResults.findOne({forelementid: req.body.checkid}).then((chkvalues) => {
            res.json({
                chkvalues
            });
        }).catch((err) => {
            res.json({error: 'error'});
        });
    };

if(req.body.type==='select'){
        Element.find({voteform: req.body.voteid, type: 'select'},'_id text').then((selectelems) => {
            res.json({
                selectelems
            });
        }).catch((err) => {
            res.json({error: 'error'});
        });
    };

 if(req.body.type==='selectresult'){
        selectResults.find({forelementid: req.body.selectid}).then((slcvalues) => {
            res.json({
                slcvalues
            });
        }).catch((err) => {
            res.json({error: 'error'});
        });
    };

});

app.get('/results', authenticate, (req, res) => {
Vote.find({userid: req.user._id}).then((votes) => {
res.render('results', {
    title: 'Vote Results',
    username: req.user.username,
            show_menu: true,
            user_menu: true,
            selectvotes: votes
});
}).catch((err) => {
res.redirect('/logout');
});
});

module.exports = {user_router};