const router = require('express').Router();
const Record = require('../models').Record;
const verifyRecordForm = require('../middlewares/record-form-handler');

router.get('/', async (req, res, next) => {
  try {
    const { count, rows } = await Record.findAndCountAll({
      where: { userId: req.user.id },
      raw: true,
      order: [['id', 'DESC']],
    });

    res.render('index', {
      count,
      records: rows.map((row) => {
        row.categoryIcon = res.locals.categories[Number(row.categoryId) - 1].icon
        return row;
      }),
      scrollTo: res.locals.scrollTo,
    });
  } catch (err) {
    err.alertMsg = '支出清單獲取失敗';
    next(err);
  }
});

router.get('/new', (_req, res) => {
  res.render('recordForm', { categories: res.locals.categories });
})

router.post('/', verifyRecordForm, async (req, res, next) => {
  try {
    const { name, date, categoryId, amount } = req.body;

    await Record.create({
      name: name.slice(0, 255),
      date: new Date(date),
      amount: Number(amount),
      userId: req.user.id,
      categoryId: Number(categoryId),
    });

    req.flash('success', '成功新增支出');
    res.redirect('/records');
  } catch (err) {
    err.alertMsg = '紀錄支出失敗';
    next(err);
  }
});

router.get('/:id/edit', async (req, res, next) => {
  try {
    const record = await Record.findByPk(req.params.id, { raw: true });

    if (!record) {
      req.flash('fail', '指定支出不存在');
      res.redirect('/records');
    } else if (record.userId !== req.user.id) {
      req.flash('fail', '該請求未授權');
      res.redirect('/records');
    } else res.render('recordForm', { categories: res.locals.categories, record });
  } catch (err) {
    err.alertMsg = '編輯指定支出請求失敗';
    next(err);
  }
});

router.put('/:id', verifyRecordForm, async (req, res, next) => {
  try {
    const { name, date, categoryId, amount } = req.body;
    const record = await Record.findByPk(req.params.id);

    if(!record) req.flash('fail', '指定支出不存在');
    else if (record.userId !== req.user.id) req.flash('fail', '該請求未授權');
    else {
      const recordId = (await record.update({
        name: name.slice(0, 255),
        date: new Date(date),
        amount: Number(amount),
        categoryId: Number(categoryId),
      })).id;

      req.flash('success', '成功更新支出');
      req.flash('scrollTo', recordId);
    }
    res.redirect('/records');
  } catch (err) {
    err.alertMsg = '修改支出失敗';
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const record = await Record.findByPk(req.params.id);

    if (!record) req.flash('fail', '指定支出不存在');
    else if (record.userId !== req.user.id) req.flash('fail', '未授權的請求');
    else {
      await record.destroy();
      req.flash('success', '成功刪除該支出');
    }
    res.redirect(`/records`);
  } catch (err) {
    err.alertMsg = '刪除支出失敗';
    next(err);
  }
});

module.exports = router;