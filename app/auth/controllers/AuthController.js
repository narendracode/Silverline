var passport = require('passport');
var User  = require('../models/UserModel.js');

exports.localSignup =   function(req, res, next){ 
    res.json({
        type:true,
        data: 'Response from local signup',
        err: ''
    });
}

exports.deleteLocalUser = function(req,res,next){
    res.json({
        type:true,
        data: 'Response from delete user',
        err: ''
    });
}

exports.localLogin = function(req, res, next){
    res.json({
        type:true,
        data: 'Response from local login',
        err: ''
    });
}