const router = require('express').Router();
const recordRoutes = require('./records');

router.get('/', (_req, res) => {
  res.redirect('/records');
});
router.use('/records', recordRoutes);

module.exports = router;