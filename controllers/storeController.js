const mongoose = require('mongoose');
const Store = mongoose.model('Store')

exports.homePage = (req, res) => {
    res.render('index', {title: Homepage})
};


exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store'});
};

exports.createStore = async (req, res) => {
    //response json request body
    // console.log(req.body);
    // res.json(req.body);

    const store = await (new Store(req.body)).save();
    // mongo save data or show error
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect('/stores/${store.slug}');
};

exports.getStores = async (req, res) => {
    // 1. Query the database from a list of all stores
    const stores = await Store.find();
    res.render('stores', {title: 'Stores', stores });
}