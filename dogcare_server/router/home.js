const express = require('express');
const router = express.Router();

const controller = require('../controller/homeContoller');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
const cors = require('cors');
router.use(cors());


router.get('/', controller.home); 

router.post('/data', controller.espData);



module.exports = router;

