(function () {
  var xhr = new XMLHttpRequest();
  var request = xhr.open('GET', 'https://raw.githubusercontent.com/timoodada/js-utils/master/xuexi/core.js', true);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && request.status !== 0) {
      eval(request.responseText);
    }
  };
  xhr.send();
})();
