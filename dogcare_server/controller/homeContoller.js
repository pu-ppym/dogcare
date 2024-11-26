const model = require('../model/mainModel');
const common = require('../common/common');

let espDatatmp;

const home = (async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {

            let viewData = await model.getData(loginUserInfo.pkid);
            console.log('이름: ', viewData.dog_name);
            console.log('나이: ', viewData.dog_age);
            console.log('종: ', viewData.dog_breed);

            /*
            viewData.vibration = espDatatmp.vibration;
            viewData.heartRate = espDatatmp.heartRate;
            viewData.temperature = espDatatmp.temperature;
             
            const result = await model.insertData(viewData.pkid, espDatatmp.heartRate, espDatatmp.temperature, espDatatmp.vibration);

            if (result) {
                console.log('Data successfully inserted:', result);
            } else {
                console.log('Data insertion failed');
            }

            if (espDatatmp.temperature < 35) {
                common.alertAndGo(res, "현재 체온이 너무 낮습니다. ", "/");
            }
                */

            res.render('index', {viewData});   // index.html
        }
        
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});


const espData = async(req, res) => {
    const data = req.body;
    espDatatmp = data;

    let loginUserInfo = common.checkLogin(req, res); 
    if (loginUserInfo != null) {
    let viewData = await model.getData(loginUserInfo.pkid);

    let { vibration, heartRate, temperature } = req.body;
    const result = await model.insertData(viewData.pkid, heartRate, temperature, vibration);   // fkdogs
    if (result != null) {
        res.redirect('/');
    }

}
    
    console.log('Received data:', data);
    
};





module.exports = {
    home,
    espData
};