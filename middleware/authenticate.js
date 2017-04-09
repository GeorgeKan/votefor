const {User} = require('./../models/user');

var authenticate = (req, res, next) => {
    if(!req.session.token){
    res.redirect('/logout');
} else {
  User.findOne({password: req.session.token}).then((token_user) => {
    if(!token_user){
        res.redirect('/logout');
    } else {
        req.user = token_user;
        next();
    }
  }, (err) => {
    res.redirect('/logout');
  });  
}
}

module.exports = {authenticate};