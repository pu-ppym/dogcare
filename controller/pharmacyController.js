const view = ((req, res) => {
    try {
        res.render('pharmacy/view');
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});

module.exports = {
    view
};