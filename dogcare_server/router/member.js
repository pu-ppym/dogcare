const express = require('express');

const router = express.Router();

const controller = require('../controller/memberController');

router.get('/', controller.signup);

router.get('/login', controller.login);

router.post('/login', controller.loginProc);

module.exports = router;