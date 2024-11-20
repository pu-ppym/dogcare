const express = require('express');
const router = express.Router();
const controller = require('../controller/memberController');
const common = require('../common/common');
const multer = require('multer');

const upload = multer({
    // 저장 장소
    dest: 'uploads/',
    // 용량 제한
    limits: {
        fileSize: 10000000, // 100MB ==> 1byte * 1kbyte => 1024byte
    }, 
    // 업로드 하는 파일 유형을 제한함
    fileFilter: common.fileFilter,     // 정상일때 여기로 fileFilter에서 
});

router.get('/register', controller.signup);

router.get('/login', controller.login);

router.post('/login', controller.loginProc);

router.post('/register', controller.registerUser);

router.post('/checkUserId', controller.checkUserId);

router.get('/', controller.checkDogInfo);

router.get('/dogInfo', controller.addDogInfo);

router.post('/dogInfo', upload.array('attach_file'), controller.addDogInfoProc);




module.exports = router;