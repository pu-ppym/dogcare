const express = require('express');
const router = express.Router();

const controller = require('../controller/pharmacyController');

router.get('/', controller.view);


module.exports = router;