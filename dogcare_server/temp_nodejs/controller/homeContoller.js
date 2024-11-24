const model = require('../model/mainModel');
const common = require('../common/common');

const home = (async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {

            let viewData = await model.getData(loginUserInfo.pkid);
            console.log('이름: ', viewData.dog_name);
            console.log('나이: ', viewData.dog_age);
            console.log('종: ', viewData.dog_breed);

            let espData = req.body;
            viewData.vibration = espData.vibration;
            viewData.heartRate = espData.heartRate;
             

            res.render('index', {viewData});   // index.html
        }
        
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});


const espData = (req, res) => {
    const data = req.body;
    console.log('Received data:', data);
};


module.exports = {
    home,
    espData
};