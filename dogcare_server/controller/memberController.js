const model = require('../model/memberModel');
const common = require('../common/common');

const signup = ((req, res) => {
    try {
        res.render('member/signup');
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});

const login = ((req, res) => {
    try {
        res.render('member/login');
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});


// 로그인 post
const loginProc = (async(req, res) => {
    try {
        let {user_id, user_pw} = req.body; 
        //console.log(user_id);
        //console.log(user_pw);
        
        // XSS 방지 -> 엄격하게
        user_id = common.reqeustFilter(user_id, 20, false);
        user_pw = common.reqeustFilter(user_pw, 20, false);


        const result = await model.loginCheck(user_id, user_pw);
        console.log(`db에서 넘어오는 로그인정보: ${result}`)

        if(result != null) {
            // 로그인 ok
            req.session.user = {
                pkid: result.pkid,  
                user_id: result.user_id
            }

            common.alertAndGo(res, "로그인 되었습니다.", "/member")
        } else {
            common.alertAndGo(res, "아이디 또는 비밀번호가 틀립니다.", "/member/login")
        }

        //res.send('처리페이지');
        
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});


const registerUser = async (req, res) => {
    try {
        
            let { user_id, user_pw} = req.body;

            // XSS 방지
            user_id = common.reqeustFilter(user_id, 20, false);
            user_pw = common.reqeustFilter(user_pw, 20, false);

            const result = await model.insertData(user_id, user_pw);

            if (result != null) {
                common.alertAndGo(res, "등록 되었습니다.", "/member/login")
                //res.redirect('/member');
        
            } else {
                common.alertAndGo(res, "등록 실패", "/member/register")
            }

        

    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
}

const checkUserId = async(req, res) => {
    try {

            // get 방식 데이터 받기
            let {user_id} = req.body;  
            console.log("Received user_id:", user_id);
            
            user_id = common.reqeustFilter(user_id, 20, false);   
            let count = await model.getUserIdCount(user_id);   // 모델에 넘겨
            
            if(count == 0) {
                res.send('true');
            } else {
                res.send('false');
            }
         
    
    } catch (error) {
        console.error("Error in checkUserId:", error);
        res.status(500).send('500 Error: ' + error);
    }
}


const checkDogInfo = async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res);
        let count = await model.getDogInfoCount(loginUserInfo.pkid);

        if (count == 0) {  // 강아지 정보 없으면 등록
            common.alertAndGo(res, "강아지 정보를 등록해주세요.", "/member/dogInfo")
        } else {   // home
            res.redirect('/');
        }
        
    } catch (error) {
        
    }
}

const addDogInfo = async(req, res) => {
    try {
        res.render('member/dogInfo');

    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
}

const addDogInfoProc = async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res);
        let {dog_name, dog_age, dog_gender, dog_breed} = req.body; // 강아지 정보 넘어올거
        //const filePaths = req.files.map(file => file.path);
        //console.log('filepath:', filePaths);

        //const filePath = req.files.length > 0 ? req.files[0].path : null;
        //console.log('filepath:', filePath);

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

        //const result = await model.insertDogData(loginUserInfo.pkid, dog_name, dog_age, dog_gender, dog_breed, JSON.stringify(filePath));
        const result = await model.insertDogData(loginUserInfo.pkid, dog_name, dog_age, dog_gender, dog_breed, filePath);

            if (result != null) {
                const resultUpdate = await model.getDogIdUpdate(loginUserInfo.pkid);
                if (resultUpdate != null) {
                    common.alertAndGo(res, "강아지 정보가 등록 되었습니다.", "/");
                } else {
                    common.alertAndGo(res, "등록, 업데이트 실패", "/member/dogInfo");
                }
                
                //res.redirect('/member');
        
            } else {
                common.alertAndGo(res, "등록 실패", "/member/dogInfo");
            }

    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
}



module.exports = {
    signup,
    login,
    loginProc,
    registerUser,
    checkUserId,
    checkDogInfo,
    addDogInfo,
    addDogInfoProc
};