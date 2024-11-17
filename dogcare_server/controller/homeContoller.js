const model = require('../model/mainModel');
const common = require('../common/common');

const home = (async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {

            let viewData = await model.getData(loginUserInfo.pkid);
            //console.log('data: ', viewData);
            console.log('이름: ', viewData.dog_name);
            console.log('나이: ', viewData.dog_age);
            console.log('종: ', viewData.dog_breed);
        }
        res.render('index');
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});

module.exports = {
    home
};