function animateNumber(numberEle, number, duration) {
  let startTime;

  function step(timestamp) {
    if (startTime === undefined) startTime = timestamp;

    const curProgressRatio = Math.min((timestamp - startTime) / duration, 1);
    numberEle.textContent = Math.floor(curProgressRatio * number).toLocaleString('zh-hant');
    if (curProgressRatio < 1) window.requestAnimationFrame(step);
  };

  window.requestAnimationFrame(step);
}

export { animateNumber }