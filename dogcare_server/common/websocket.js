const webSocket = require('ws');
const homeController = require('../controllers/homeController');
const gpsViewController = require('../controllers/gpsViewController');
/*
const wss = new webSocket.Server({ port: 5000 });

wss.on('connection', (ws) => {
    console.log('웹소켓 연결됨');

    // 메시지 수신 처리
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            // 데이터에 따라 컨트롤러로 전달
            if (data.type === 'health') {
                homeController.handleHealthData(data);
            } else if (data.type === 'gps') {
                gpsViewController.handleGpsData(data);
            } else {
                console.error('알 수 없는 데이터 유형:', data.type);
            }
        } catch (error) {
            console.error('메시지 처리 중 오류:', error);
        }
    });

    // 연결 종료 처리
    ws.on('close', () => {
        console.log('웹소켓 연결 종료');
    });
});
*/