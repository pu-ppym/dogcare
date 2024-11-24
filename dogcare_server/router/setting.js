const express = require('express');
const router = express.Router();

const controller = require('../controller/settingContoller');
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


router.get('/', controller.settings); 
router.get('/update', controller.updateDoginfo); 
router.get('/logout', controller.logout);
router.post('/update', upload.array('attach_file'), controller.updateProc);
router.get('/change', controller.changeDogProf);
router.post('/change', controller.changeDogProfProc);


module.exports = router;

