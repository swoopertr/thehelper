helper = {
  Screen: {
    isInViewport: function (elem) {
      var distance = elem.getBoundingClientRect();
      return (
        distance.top >= 0 &&
        distance.left >= 0 &&
        distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        distance.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },
    scrollTop: function (cb) {
      var intervalId = setInterval(function () {
        if (!cb || typeof cb !== 'function') return;
        if (window.pageYOffset === 0) {
          clearInterval(intervalId);
          cb && cb();
        }
        window.scrollTo(0, window.pageYOffset - 50);
      }, 16.66);
    },
    scrollToBottom: function () {
      window.scrollTo(0, document.body.scrollHeight);
    },
    scrollToElem: function (elem) {
      elem.scrollIntoView(true);
    }
  }
};