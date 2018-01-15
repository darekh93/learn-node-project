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

exports.editStore = async (req, res) => {
    // 1. Find the store given the ID
    const store = await Store.findOne({ _id: req.params.id})
    // 2. confirm they are the owner of the store
    // 3. Render out the edit form so then user can update their store
    res.render('editStore', { title: `Edit ${store.name}`, store })
}

exports.updateStore = async (req, res) => {
    // find and update the store
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, 
        {
        new: true, // return the new store instead of the old one
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View store</a>`);
    res.redirect(`/stores/${store._id}/edit`);
    // Redirect them the store and teel them it worked
}