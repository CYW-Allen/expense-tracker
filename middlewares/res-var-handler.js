const Category = require('../models').Category;

module.exports = async (req, res, next) => {
  try {
    const categoryIcon = {
      家居物業: 'fas fa-home',
      交通出行: 'fas fa-shuttle-van',
      休閒娛樂: 'fas fa-grin-beam',
      餐飲食品: 'fas fa-utensils',
      其他: 'fas fa-pen',
    };

    res.locals.categories = (await Category.findAll({ raw: true })).map((category) => ({
      ...category,
      icon: categoryIcon[category.name],
    }));
    res.locals.successMsg = req.flash('success');
    res.locals.alertMsg = req.flash('fail');
    res.locals.scrollTo = req.flash('scrollTo');
    res.locals.user = req.user;
  } catch (err) {
    return next(err);
  }

  next();
};