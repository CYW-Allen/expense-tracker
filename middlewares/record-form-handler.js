module.exports = (req, res, next) => {
  const { name, date, categoryId, amount } = req.body;
  const categories = res.locals.categories;

  if (!name || !name.replace(/\s/g, '').length) {
    req.flash('fail', '無效的支出項目名');
    return res.redirect('back');
  }

  if (!date || isNaN(new Date(date).getTime())) {
    req.flash('fail', '無效的支出日期');
    return res.redirect('back');
  }
  
  if (!categoryId || !categories.some((category) => category.id === Number(categoryId))) {
    req.flash('fail', '無效的支出類別');
    return res.redirect('back');
  }

  if (!amount || isNaN(amount) || Number(amount) < 0) {
    req.flash('fail', '無效的支出金額');
    return res.redirect('back');
  }

  next();
};