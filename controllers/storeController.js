const mongoose = require('mongoose');
const Store = mongoose.model('Store')

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index')
};


exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store'});
};

exports.createStore = async (req, res) => {
    //response json request body
    // console.log(req.body);
    // res.json(req.body);

    const store = new Store(req.body);
    // mongo save data or show error
    await store.save()
    res.redirect('/');
};