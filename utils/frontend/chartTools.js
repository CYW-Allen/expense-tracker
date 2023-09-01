function getLineChartCfg(records, chartEleId) {
  const dailyAmount = records.reduce((chartData, record) => {
    if (chartData[record.date]) chartData[record.date] += record.amount;
    else chartData[record.date] = record.amount;
    return chartData;
  }, {});

  return {
    title: {
      text: '每日總支出統計',
      position: 'top-center',
    },
    data: {
      x: 'x',
      columns: [
        ['x', ...Object.keys(dailyAmount)],
        ['總金額', ...Object.values(dailyAmount)],
      ],
    },
    size: { width: 1200, height: 500 },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d',
          rotate: -30,
          multiline: false,
        },
      },
      y: {
        tick: {
          format(d) {
            if (Math.floor(d) !== d) return;
            return d;
          },
        },
        padding: { top: 10, bottom: 10 },
      },
    },
    legend: { show: false },
    grid: { y: { show: true } },
    padding: { top: 10, left: 60 },
    bindto: `#${chartEleId}`,
  }
}

function getPieChartCfg(records, categories, chartId) {
  const categoryName = {};
  const amountInCategory = records.reduce((chartData, record) => {
    const category = categoryName[record.categoryId]
      || categories.find((category) => category.id === record.categoryId).name;

    categoryName[record.categoryId] = category;
    if (chartData[category]) chartData[category] += record.amount;
    else chartData[category] = record.amount;
    return chartData;
  }, {});

  return {
    title: {
      text: '各類別支出占比',
      position: 'top-center',
    },
    data: {
      type: 'pie',
      columns: Object.entries(amountInCategory),
      names: Object.entries(amountInCategory).reduce((result, [category, amount]) => {
        result[category] = `${category}  $ ${amount}`;
        return result;
      }, {}),
    },
    legend: { position: 'right' },
    size: { width: 500 },
    bindto: `#${chartId}`,
  };
}

export { getLineChartCfg, getPieChartCfg };