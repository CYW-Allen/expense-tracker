const router = require('express').Router();
const Record = require('../models').Record;
const verifyRecordForm = require('../middlewares/record-form-handler');

router.get('/', async (_req, res, next) => {
  try {
    const userId = 1;
    const { count, rows } = await Record.findAndCountAll({
      where: { userId },
      raw: true,
      order: [['date', 'DESC']],
    });

    res.json({ count, rows, categories: res.locals.categories });
  } catch (err) {
    err.alertMsg = '支出清單獲取失敗';
    next(err);
  }
});

router.post('/', verifyRecordForm, async (req, res, next) => {
  try {
    const { name, date, categoryId, amount } = req.body;
    const userId = 1;
    const record = await Record.create({
      name: name.slice(0, 255),
      date: new Date(date),
      amount: Number(amount),
      userId,
      categoryId: Number(categoryId),
    });

    res.json(record);
  } catch (err) {
    err.alertMsg = '紀錄支出失敗';
    next(err);
  }
});

// for dev
router.get('/:id', async (req, res, next) => {
  try {
    const userId = 1;
    const record = await Record.findByPk(req.params.id, { raw: true });

    res.json(record);
  } catch (err) {
    err.alertMsg = '查詢指定支出失敗';
    next(err);
  }
});

router.put('/:id', verifyRecordForm, async (req, res, next) => {
  try {
    const { name, date, categoryId, amount } = req.body;
    const userId = 1;
    const record = await Record.findOne({
      where: { id: req.params.id, userId },
    });

    if (record) {
      await record.update({
        name: name.slice(0, 255),
        date: new Date(date),
        amount: Number(amount),
        categoryId: Number(categoryId),
      });
      res.send('The record is success to update.');
    } else res.send('The required record is not existed');
  } catch (err) {
    err.alertMsg = '修改支出失敗';
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const userId = 1;
    const record = await Record.findByPk(req.params.id);

    if (!record) req.flash('fail', '指定支出不存在');
    else if (record.userId !== userId) req.flash('fail', '未授權的請求');
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