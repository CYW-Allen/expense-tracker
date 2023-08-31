const router = require('express').Router();

const authRoutes = require('./auth');
const usersRoutes = require('./users');
const checkAuth = require('../middlewares/auth-handler');
const recordRoutes = require('./records');

router.get('/', (_req, res) => {
  res.redirect('/records');
});
router.use(authRoutes);
router.use('/users', usersRoutes);
router.use('/records', checkAuth, recordRoutes);

module.exports = router;