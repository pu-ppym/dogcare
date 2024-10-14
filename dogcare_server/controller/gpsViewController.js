//const model = require('../model/boardModel');

const gpsView = ((req, res) => {
    try {
        res.render('gps/gpsView');
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});

module.exports = {
    gpsView
};