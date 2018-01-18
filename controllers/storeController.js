const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
      const isPhoto = file.mimetype.startsWith('');
      if(isPhoto) {
        next(null, true);
      } else {
        next({ message: 'That filetype isnt fallowed!'}, false);
      }
    }
};

exports.homePage = (req, res) => {
    res.render('index', {title: Homepage})
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if ( !req.file ) {
    next(); //skip to next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`; 
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo our filesystem, keep gooing!;
  next();
}

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
    res.redirect(`/store/${store.slug}`);
    res.redirect('/store/${store.slug}');
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
    // set the location data to be a point
    req.body.location.type = 'Point';
    // find and update the store
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, 
        { 
        new: true, // return the new store instead of the old one
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/store/${store.slug}">View store</a>`);
    res.redirect(`/stores/${store._id}/edit`);
    // Redirect them the store and teel them it worked
}

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });
  // res.json(store)
  if(!store) return next();
  res.render('store', { store, title: store.name });
}

exports.getStoresByTag = async (req, res) => {
    const tag = req.params.tag;
    const tagQuery = tag || { $exists: true };
    const tagsPromise = Store.getTagsList();
    const storesPromise = Store.find({ tags: tagQuery });
    const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
    // res.json(result);
    res.render('tag', { tags, title: 'Tags', tag, stores })
};