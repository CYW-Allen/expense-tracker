function getRandomInt(range) {
  return Math.floor(Math.random() * range);
}

function randomScale(baseValue) {
  return parseFloat((1 + Math.random()).toFixed(1) * baseValue);
}

module.exports = { getRandomInt, randomScale };