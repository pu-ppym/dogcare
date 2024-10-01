const express = require('express');

const router = express.Router();

const controller = require('../controller/gpsViewController');

router.get('/', controller.gpsView);


module.exports = router;