var express = require('express');
var router = express.Router();

var authController = require('../app/auth/controllers/AuthController.js');
var passportConfig = require('../app/auth/passport.js');

router.post('/signup',authController.localSignup);
router.post('/login',authController.localLogin);
router.delete('/signup',authController.deleteLocalUser);
router.post('/upload',authController.uploadImg);
router.get('/users',authController.getUsers);
router.get('/user/:phone',authController.getUser);
router.put('/user/:phone',authController.editUser);

module.exports = router;