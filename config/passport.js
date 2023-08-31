const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('../models').User;

passport.use(new LocalStrategy({ usernameField: 'name' }, async (username, password, done) => {
  try {
    const user = await User.findOne({
      attributes: ['id', 'name', 'password'],
      where: { name: username },
      raw: true,
    });
    if (!user) return done(null, false, { type: 'fail', message: '該名稱尚未註冊' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { type: 'fail', message: '密碼錯誤' });
    
    done(null, user);
  } catch (e) {
    e.alertMsg = '登入失敗';
    done(e);
  }
}));

passport.serializeUser((user, done) => {
  const { id, name } = user;
  done(null, { id, name });
});

passport.deserializeUser((user, done) => {
  done(null, { id: user.id });
})

module.exports = passport;