const express = require('express');

const router = express.Router();

const controller = require('../controller/memberController');

router.get('/register', controller.signup);

router.get('/login', controller.login);

router.post('/login', controller.loginProc);

router.post('/register', controller.registerUser); 

router.post('/checkUserId', controller.checkUserId);

router.get('/', controller.checkDogInfo);

router.get('/dogInfo', controller.addDogInfo);

router.post('/dogInfo', controller.addDogInfoProc);

module.exports = router;