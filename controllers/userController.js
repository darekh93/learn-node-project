const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify')

exports.loginForm = (req, res) => {
  res.render('login', {title: 'Login'})
}

exports.registerForm = (req, res) => {
  res.render('register', {title: 'Register'});
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That Email is not valid!').notEmpty();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extensions: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
  req.checkBody('password-confirm', 'Password Cannot be Blank!').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  console.log(errors);
  if(errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return; //stop the form running
  }
  next(); //there were no errors
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next(); //pass to authController.login
}