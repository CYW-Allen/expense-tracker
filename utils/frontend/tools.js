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

function getFormatDateStr(dateObj) {
  const reqDateObj = dateObj instanceof Date ? dateObj : new Date();

  return reqDateObj.toLocaleDateString('zh-Hant', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '-');
}

export { throttle, debounce, wait, getFormatDateStr };