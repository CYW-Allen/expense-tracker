function throttle(func, delay = 500) {
  let timer = null;

  return (...args) => {
    if (timer) return;
    timer = setTimeout(() => {
      func(...args);
      timer = null;
    }, delay);
  }
}

function debounce(func, delay = 1000) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func(...args); }, delay);
  };
}

function wait(duration) {
  return new Promise((resolve, _reject) => {
    setTimeout(() => resolve(), duration);
  });
}

module.exports = { throttle, debounce, wait };