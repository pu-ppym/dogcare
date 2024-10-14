const home = ((req, res) => {
    try {
        res.render('index');
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});

module.exports = {home};