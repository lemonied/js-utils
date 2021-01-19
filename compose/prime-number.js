function primeNumber(max = 1000000) {
  const arr = [];
  function loop(num) {
    if (arr.every(v => num % v !== 0)) {
      arr.push(num);
    }
    if (num < max) {
      return Promise.resolve().then(() => loop(num + 1));
    }
    return Promise.resolve();
  }
  return loop(2).then(() => arr[arr.length - 1]);
}

primeNumber().then(res => {
  console.log(res);
});
