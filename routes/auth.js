const router = require('express').Router();
const passport = require('passport');

router.get('/login', (_req, res, _next) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/records',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.post('/logout', (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      err.alertMsg = '登出失敗';
      return next(err);
    }
    res.redirect('/login');
  })
});

router.get('/register', (_req, res, _next) => {
  res.render('register');
});

module.exports = router;