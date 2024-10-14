const express = require('express');
const nunjucks = require('nunjucks');

const app = express();
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
});

// 정적파일 처리
app.use('/assets', express.static(__dirname + '/assets'));

// 세션사용을 위한 세팅
const session = require('express-session');
const sessionFile = require('session-file-store')(session);

// 세션 세팅
app.use(session({
    secret: "kiwu",
    resave: true,
    store: new sessionFile({logFn: function(){}})
}));

// post 값 받기
app.use(express.urlencoded({
    extended: true
}));

indexRouter = require('./router/home');
gpsViewRouter = require('./router/gpsView');
memberRouter = require('./router/member');

pharmacyRouter = require('./router/pharmacy');

app.use('/', indexRouter);
app.use('/gps', gpsViewRouter);
app.use('/member', memberRouter);

app.use('/pharmacy', pharmacyRouter);


//nunjucks
/*    
app.get('/', (req, res) => {
    console.log('첫페이지 접속됨');

    let fruits = ['apple', 'banana', 'orange']
    const sendData = {
        name: "jio",
        fruits
    }
    res.render('index', sendData);
}); 
*/


/*
// get,post,put,delete
app.get('/', (req, res) => {
    console.log('첫페이지 접속됨');
    res.send('<h1>안녕</h1> 김지오의 홈페이지')
});  

app.get('/member', (req, res) => {
    console.log('회원페이지 접속됨');
    res.send('<h1>안녕</h1> 회원페이지')
});  

app.get('/board', (req, res) => {
    console.log('게시판페이지 접속됨');
    res.send('<h1>안녕</h1> 게시판페이지')
});
*/

// 404 not found
app.use((req,res) => {
    console.log('여기');
    res.status(404).send('404 not found');
});


app.listen(80, () => {
    console.log('80포트에서 express 서버 대기 중...');
});

