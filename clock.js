var initClock = function () {
  var clock = document.getElementById('clock');
  var showCurrentTime = function () {
    clock.textContent = new Date().toLocaleString();
    setTimeout(function () {
      showCurrentTime();
    }, 1000);
  };
  showCurrentTime();
  //    setInterval(function () {
  //        showCurrentTime();
  //    }, 1000);
};
initClock();
