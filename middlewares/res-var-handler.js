const Category = require('../models').Category;

module.exports = async (req, res, next) => {
  try {
    const categoryIcon = {
      家居物業: "https://fontawesome.com/icons/home?style=solid",
      交通出行: "https://fontawesome.com/icons/shuttle-van?style=solid",
      休閒娛樂: "https://fontawesome.com/icons/grin-beam?style=solid",
      餐飲食品: "https://fontawesome.com/icons/utensils?style=solid",
      其他: "https://fontawesome.com/icons/pen?style=solid"
    };

    res.locals.categories = (await Category.findAll({ raw: true })).reduce((obj, category) => {
      obj[category.id] = {
        name: category.name,
        icon: categoryIcon[category.name],
      };
      return obj;
    }, {});
    res.locals.successMsg = req.flash('success');
    res.locals.alertMsg = req.flash('fail');
  } catch (err) {
    return next(err);
  }

  next();
};