var LocalStrategy   = require('passport-local').Strategy;
var User  = require('../models/UserModel.js');
var Info  = require('../models/InfoModel.js');
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
                var info = new Info();
                info.name = req.body.name;
                info.email = req.body.email;
                info.profilePic = req.body.profilePic;
                info.address = req.body.address;
                info.dob = parseDate(req.body.dob);
                info.save(function(err,sInfo) {
                    if (err){
                        return done(null,{
                            type:false,
                            data: 'error occured '+ err
                        });
                    }
                    var newUser  = new User();
                    newUser.role =  'user';
                    newUser.local.phone = phone;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.info = sInfo._id;
                    newUser.save(function(err,user) {
                        if (err){
                            return done(null,{
                                type:false,
                                data: 'error occured '+ err
                            });
                        }
                        var cert = fs.readFileSync('key.pem');
                        var token = jwt.sign({
                            email: info.email,
                            role : user.role,
                            name : info.name,
                            phone:user.local.phone,
                            profilePic:info.profilePic
                        }, cert, { algorithm: 'HS512'});
                        return done(null, {type : true,err:'', data:{'token' : token}});
                    }); 
                });
            }
        });    
    });
});

exports.loginStrategy = new LocalStrategy({
    usernameField : 'phone',
    passwordField : 'password',
    passReqToCallback : true 
},
function(req, phone, password, done) {
    process.nextTick(function() {
        var mUser = new User();
        User.findOne({'local.phone': phone})
            .populate('info')
            .exec(function(err,user){
            if (err){
                return done(err);
            }
            if (!user) {
                return done(null, {type: false, 'data': {},'err':"Account doesn't exists with the phone number provided."});
            }
            if(!user.validPassword(password)){
                return done(null, {type: false, data:{},'err': 'Password is wrong.'}); 
            }
            var cert = fs.readFileSync('key.pem');
            var token = jwt.sign({
                email: user.info.email,
                role : user.role,
                name : user.info.name,
                phone: user.local.phone,
                profilePic: user.info.profilePic
            }, cert, { algorithm: 'HS512'});
            return done(null, {type : true, data:{'token' : token},err:''}); 
        });  
    });
});