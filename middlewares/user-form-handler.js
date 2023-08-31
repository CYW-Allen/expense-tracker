module.exports = (req, res, next) => {
  const { name, password, confirmPwd } = req.body;
  const inputName = name?.replace(/\s/g, '');

  if (!inputName || !password) {
    req.flash('fail', '名稱及密碼為必填');
    return res.redirect('back');
  }
  
  if (!confirmPwd || password !== confirmPwd) {
    req.flash('fail', '驗證密碼與密碼不符');
    return res.redirect('back');
  }

  next();
}