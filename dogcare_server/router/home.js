const express = require('express');

const router = express.Router();

const controller = require('../controller/homeContoller');

router.get('/', controller.home); 

module.exports = router;
/*  
module.exports = {
    router
}
*/