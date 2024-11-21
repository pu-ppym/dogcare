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
app.use('/img', express.static(__dirname + '/img'));

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
weatherRouter = require('./router/weather');

app.use('/', indexRouter);
app.use('/gps', gpsViewRouter);
app.use('/member', memberRouter);

app.use('/pharmacy', pharmacyRouter);
app.use('/weather', weatherRouter);




// 404 not found
app.use((req,res) => {
    console.log('여기');
    res.status(404).send('404 not found');
});


app.listen(3000, () => {
    console.log('3000포트에서 express 서버 대기 중...');
});

