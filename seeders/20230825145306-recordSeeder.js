'use strict';
const bcrypt = require('bcryptjs');
const { getRandomInt, randomScale } = require('../utils/backend/tools');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const username = 'user1';
    const password = '12345678';
    const categories = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他'];

    try {
      const hash = await bcrypt.hash(password, 10);

      await queryInterface.sequelize.transaction(async (transaction) => {
        const userId = await queryInterface.bulkInsert('Users', [{
          name: username,
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date(),
        }], { transaction });

        const categoryBaseId = await queryInterface.bulkInsert('Categories', categories.map((category) => ({
          name: category,
          createdAt: new Date(),
          updatedAt: new Date(),
        })), { transaction });

        await queryInterface.bulkInsert('Records', generateRandomRecs(30, userId, categoryBaseId), { transaction })
      })
    } catch (err) {
      console.log(err);
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null);
    await queryInterface.bulkDelete('Categories', null);
  }
};

function getRoutine(recPattern, routineCategory, date, userId) {
  return recPattern[routineCategory].map(([name, expense]) => ({
    name,
    date,
    amount: randomScale(expense),
    userId,
    categoryId: routineCategory,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

function getIncidents(recPattern, incidentCategories, date, userId) {
  const incidents = [];
  const incidentNum = getRandomInt(6);

  for (let i = 0; i < incidentNum; i++) {
    const incidentCategory = incidentCategories[getRandomInt(4)];
    const [name, expense] = recPattern[incidentCategory][getRandomInt(4)];

    incidents.push({
      name,
      date,
      amount: randomScale(expense),
      userId,
      categoryId: incidentCategory,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return incidents;
}

function generateRandomRecs(days, userId, categoryBaseId) {
  const output = [];
  const recPattern = {
    // 家居物業
    [categoryBaseId]: [['租金', 15000], ['水電費', 3000], ['手機帳單', 1000], ['網路費', 1000]],
    // 交通出行
    [categoryBaseId + 1]: [['捷運', 150], ['公車', 30], ['UBIKE', 30], ['計程車', 200]],
    // 休閒娛樂
    [categoryBaseId + 2]: [['電影', 500], ['KTV', 500], ['書店', 300], ['逛街', 1000]],
    // 餐飲食品
    [categoryBaseId + 3]: [['早餐', 60], ['午餐', 100], ['晚餐', 100], ['宵夜', 60]],
    // 其他
    [categoryBaseId + 4]: [['看診', 250], ['維修費', 500], ['交際費', 500], ['網購', 1000]],
  };
  const routineCategory = Number(categoryBaseId) + 3;
  const incidentCategories = Array.from({ length: 5 }, (_, index) => Number(categoryBaseId) + index)
    .filter((id) => id !== routineCategory);

  for (let pastDay = days; pastDay >= 0; pastDay--) {
    const curTime = new Date();
    const recordTime = new Date(curTime.setDate(curTime.getDate() - pastDay));

    output.push(
      ...getRoutine(recPattern, routineCategory, recordTime, userId),
      ...getIncidents(recPattern, incidentCategories, recordTime, userId)
    );
  }
  return output;
}
