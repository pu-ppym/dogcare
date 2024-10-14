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

const loginProc = ((req, res) => {
    try {
        let {user_id, user_pw} = req.body; // 알아서 매핑해줌?
        //console.log(user_id);
        //console.log(user_pw);
        if(user_id == 'jio' && user_pw == '1234') {
            // 로그인 ok
            req.session.user = {
                pkid: '1',
                user_id: 'jio',
                user_name: '지오'
            }
            res.send('<script>alert("로그인 되었습니다."); location.href="/"; </script>');
            res.end();
        } else {
            res.send('<script>alert("아이디 또는 비밀번호가 틀립니다."); location.href="/member/login"; </script>');
            res.end();
        }

        //res.send('처리페이지');
        
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});

module.exports = {
    signup,
    login,
    loginProc
};