const express = require('express');
const router = express.Router();

const controller = require('../controller/pharmacyController');

router.get('/', controller.view);

router.post('/', controller.getLocation);


module.exports = router;