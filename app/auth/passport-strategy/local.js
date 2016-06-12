var LocalStrategy   = require('passport-local').Strategy;
var User  = require('../models/UserModel.js');
var jwt   = require("jsonwebtoken");
var config = require('../../../config/config');
var fs = require('fs');


// parse a date in yyyy-mm-dd format
function parseDate(input) {
    var parts = input.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
}

exports.signupStrategy = new LocalStrategy({
    usernameField : 'phone',
    passwordField : 'password',
    passReqToCallback : true 
},
  function(req, phone, password, done) {
    process.nextTick(function() {
        var name = req.body.name;
        User.findOne({ 'local.phone' :  phone }, function(err, user) {
            if (err){
                return done(err);
            }
            if (user) {
                return done(null, {type : false,err: 'Account already registered with '+phone+'.',data:{}});
            } else {
                var newUser  = new User();
                newUser.role =  'user';
                newUser.local.phone = phone;
                newUser.name = req.body.name;
                newUser.email = req.body.email;
                newUser.profilePic = req.body.profilePic;
                newUser.address = req.body.address;
                newUser.dob = parseDate(req.body.dob);
                console.log(" dob:"+newUser.dob)
                newUser.local.password = newUser.generateHash(password);
                newUser.save(function(err,user) {
                    if (err){
                        return done(null,{
                            type:false,
                            data: 'error occured '+ err
                        });
                    }
                    var cert = fs.readFileSync('key.pem');
                    var token = jwt.sign({
                                            email: user.email,
                                            role : user.role,
                                            name : user.name,
                                            phone:user.local.phone,
                                            profilePic:user.profilePic
                                         }, cert, { algorithm: 'HS512'});
                    return done(null, {type : true,err:'', data:{'token' : token}});
                });   
            }
        });    
    });
});

exports.loginStrategy = new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true 
},
  function(req, email, password, done) {
    process.nextTick(function() {
        var mUser = new User();
        User.findOne({'local.email': email}, function(err, user) {
            if (err){
                return done(null,{type:false,data: 'error occured '+ err});
            }
            if (!user) {
                return done(null, {type: false, 'data': "Account doesn't exists with the email provided."});
            } 
            if(!user.validPassword(password)){
                return done(null, {type: false, 'data': 'Password is wrong.'}); 
            }
            return done(null, {type : true, token : user.token,err:''});
        });    
    });
});