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

            common.alertAndGo(res, "로그인 되었습니다.", "/")
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
        let loginUserInfo = common.checkLogin(req, res);
        if (loginUserInfo != null) {
            let { user_id, user_pw} = req.body;

            // XSS 방지
            user_id = common.reqeustFilter(user_id, 20, false);
            user_pw = common.reqeustFilter(user_pw, 20, false);

            const result = await model.insertData(user_id, user_pw);

            if (result != null) {
                common.alertAndGo(res, "등록 되었습니다.", "/member")
                //res.redirect('/member');
        
            } else {
                common.alertAndGo(res, "등록 실패", "/member/register")
            }

        }

    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
}





module.exports = {
    signup,
    login,
    loginProc,
    registerUser
};