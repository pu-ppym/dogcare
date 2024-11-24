const model = require('../model/mainModel');
const common = require('../common/common');

  
const settings = async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {

            let viewData = await model.getData(loginUserInfo.pkid);

            res.render('settings/settingView', {viewData});
        }
        
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
}

const updateDoginfo = async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {

            let viewData = await model.getData(loginUserInfo.pkid);
            console.log('넘겨줄거:',viewData.dog_name);

            res.render('settings/updateView', {viewData});
        }
        
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
}

const updateProc = async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res);
        let {dog_name, dog_age, dog_gender, dog_breed} = req.body; // 강아지 정보 넘어올거
        let viewData = await model.getData(loginUserInfo.pkid);
        let dogName = viewData.dog_name;
      
        let {filePath, originalname} = ['', ''];
        if(req.files[0] != null) {
            originalname = req.files[0].originalname;

            // 파일명 변경
            filePath = 'uploads/' + req.files[0].filename + common.getFileExtension(req.files[0].originalname);
            console.log('proc 파일경로: ', filePath);
            console.log('moveFile 테스트, sourceFile : ', req.files[0].filename);
            
            // 파일을 실제 변경해줌
            common.moveFile('uploads/' + req.files[0].filename, filePath); 
        }

        // 어케수정하지
        const result = await model.updateDogData(loginUserInfo.pkid, dog_name, dog_age, dog_gender, dog_breed, filePath, dogName);

            if (result != null) {
                common.alertAndGo(res, "강아지 정보가 수정되었습니다.", "/");
                //res.redirect('/member');
        
            } else {
                common.alertAndGo(res, "수정 실패", "/setting/update");
            }

    } catch (error) {
        res.status(500).send('500 Error: ' + error);
        console.log(error);
    }
}


const logout = async(req, res) => {
    try {
        const sessionId = req.sessionID; // 현재 세션 ID
        
        const result = await model.logout(sessionId);
        
        // 세션 종료
        req.session.destroy(err => {
            if (err) {
                console.error('세션 삭제 중 오류:', err);
                return res.status(500).send('로그아웃 처리 중 오류가 발생했습니다.');
            }
        });

        if (result != null) {
            common.alertAndGo(res, "로그아웃 되었습니다. ", "/member/login")
            //res.redirect('/member');
    
        } else {
            common.alertAndGo(res, "로그아웃 실패", "/member/register")
        }

    } catch (error) {
        console.error('로그아웃 처리 중 오류:', error);
        res.status(500).send('로그아웃 처리 중 오류가 발생했습니다.');
    }
}


const changeDogProf = async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {

            let viewData = await model.getDogData(loginUserInfo.pkid);
            console.log('이미지안뜸:', viewData[0].dog_image);

            let dataCount = viewData.length;
            console.log('강아지 정보 몇개: ', dataCount);

            res.render('settings/changeProfile', {viewData, dataCount});
        }
        
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
}


const changeDogProfProc = async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {

            let {dog_pkid} = req.body;
            console.log(dog_pkid);
            const result = await model.updateProfile(dog_pkid, loginUserInfo.pkid);

            if (result != null) {
                common.alertAndGo(res, "프로필이 변경 되었습니다. ", "/");
                //res.redirect('/member');
        
            } else {
                common.alertAndGo(res, "변경 실패", "/setting/change");
            }

        }
        
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
}


module.exports = {
    settings,
    updateDoginfo,
    logout,
    updateProc,
    changeDogProf,
    changeDogProfProc
};