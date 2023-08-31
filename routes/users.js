const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models').User;
const verifyUserForm = require('../middlewares/user-form-handler');

router.post('/', verifyUserForm, async (req, res, next) => {
  try {
    const { name, password } = req.body;

    await User.create({ name, password: await bcrypt.hash(password, 10) });
    req.flash('success', '註冊成功');
    res.redirect('/login');
  } catch (err) {
    err.alertMsg = err.name === 'SequelizeUniqueConstraintError'
      ? '此名稱已註冊過' : '註冊失敗';
    next(err);
  }
});

module.exports = router;