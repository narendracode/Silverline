var passport = require('passport');
var User  = require('../models/UserModel.js');
var config = require('../../../config/config.js');
var fs = require('fs');
var multer = require('multer');

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(" store destination is called file name :"+file.name+"   ,path : "+file.path);
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        console.log(" store filename is called file name :"+file.name+"   ,path : "+file.path);
        callback(null, file.fieldname + '-' + Date.now());
    }
});
var upload = multer({ dest : config.upload}).single('userPhoto');



exports.localSignup = function(req, res, next){ 
    passport.authenticate('local-signup',function(err, user, info){
        if (err) { 
            return res.json({type:false,data:{},err: 'error occured '+ err}); 
        }
        return res.json(user);
    })(req, res, next);
}

exports.deleteLocalUser = function(req,res,next){
    res.json({
        type:true,
        data: 'Response from delete user',
        err: ''
    });
}

exports.localLogin = function(req, res, next){
    passport.authenticate('local-login',function(err, user, info){
        if (err) { 
            return res.json({type:false,err: 'error occured '+ err, data:{}}); 
        }
        if(user){
            return res.json(user);
        }
    })(req, res, next);
}


exports.uploadImg = function(req,res){
    console.log(" File log : "+req.files.file.name+"    ,path: "+req.files.file.path);
    var s = req.files.file.path.split("/");    
    // get the temporary location of the file
    var tmp_path = req.files.file.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './uploads/' + s[s.length - 1];

    //check file size
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) {
                res.json({result: false});
            }else{
                console.log('File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes');
                res.json({result : true, file : { name : s[s.length - 1]}});
            };
        });
    });
};