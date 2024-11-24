const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
});

// 정적파일 처리
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));    // 경로구분자 처리해줌 날씨이미지.. 안되면 이렇게해야됨

//console.log('app 테스트: ', path.join(__dirname, 'uploads'));
//console.log('app 테스트_기존: ', __dirname + '/uploads');




// 세션사용을 위한 세팅
const session = require('express-session');
//const sessionFile = require('session-file-store')(session);
const sessionDB = require('express-mysql-session')(session);
const db = require('./common/db');


// 세션 세팅
app.use(session({
    secret: "jio",
    resave: true,
    //store: new sessionFile({logFn: function(){}})
    store: new sessionDB(db.db)
}));

// post 값 받기
app.use(express.urlencoded({
    extended: true
}));

indexRouter = require('./router/home');
gpsViewRouter = require('./router/gpsView');
memberRouter = require('./router/member');
pharmacyRouter = require('./router/pharmacy');
weatherRouter = require('./router/weather');

app.use('/', indexRouter);
app.use('/gps', gpsViewRouter);
app.use('/member', memberRouter);

app.use('/pharmacy', pharmacyRouter);
app.use('/weather', weatherRouter);


// 웹소켓 테스트
const startWebSocketServer = require('./common/websocket'); // websocket.js 불러오기
// WebSocket 서버 실행
startWebSocketServer();


// 404 not found
app.use((req,res) => {
    console.log('여기');
    res.status(404).send('404 not found');
});


app.listen(3000, () => {
    console.log('3000포트에서 express 서버 대기 중...');

    
});

