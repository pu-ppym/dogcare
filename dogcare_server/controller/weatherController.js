const view = ((req, res) => {
    try {
        res.render('weather/weatherView');
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});

module.exports = {
    view
};