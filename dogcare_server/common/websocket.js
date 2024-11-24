const webSocket = require('ws');
//const homeController = require('../controllers/homeController');
//const gpsViewController = require('../controllers/gpsViewController');

function startWebSocketServer() {
    const wss = new webSocket.Server({ port: 5000 });
  
    wss.on('connection', (ws) => {
      console.log('클라이언트 연결됨');
    
      ws.on('message', (message) => {
        console.log('받은 데이터:', message);
    
        // JSON 파싱
        const data = JSON.parse(message);
        if (data.type === 'heartRate') {
          console.log(`심박수 데이터: ${data.value} BPM`);
        } else if (data.type === 'vibration') {
          console.log(`걸음 수 데이터: ${data.value}`);
        }
      });
    
      ws.on('close', () => {
        console.log('클라이언트 연결 종료');
      });
    });
  
    console.log('WebSocket 서버 실행 중. 포트 5000...');
  }
  
module.exports = startWebSocketServer;


