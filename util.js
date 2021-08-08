helper = {
  Util: {
    removeElement: function (element) {
      element.parentNode.removeChild(element);
    },
    insertAfter: function (el, strHtml) {
      el.insertAdjacentHTML('afterend', strHtml);
    },
    isInIframe: function () {
      return window.location !== window.parent.location;
    },
    getProperties: function (jsObj) {
      return Object.keys(jsObj);
    },
    isEmpty: function (jsObj) {
      return (
        Object.prototype.toString.call(value) === '[object Object]' &&
        JSON.stringify(value) === '{}'
      );
    },
    domReady: function (cb) {
      if (typeof cb !== 'function') return;
      if (document.readyState === 'interactive' ||
        document.readyState === 'complete') {
        return cb();
      }
      document.addEventListener('DOMContentLoaded', cb, false);
    },
    disableRightClick: function () {
      document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      });
    },
    adblock: function (cb) {
      var adBlockEnabled = false;
      var testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      document.body.appendChild(testAd);
      window.setTimeout(function () {
        if (testAd.offsetHeight === 0) {
          adBlockEnabled = true;
        }
        testAd.remove();
        console.log('AdBlock Enabled? ', adBlockEnabled);
        cb && cb();
      }, 100);
    },
    isScriptLoaded: function (src) {
      var scripts = document.getElementsByTagName("script");
      for (var i = 0; i < scripts.length; i++)
        if (scripts[i].getAttribute('src') == src) return true;
      return false;
    },
    loadScriptAsync: function (url, cb, errcb) {
      try {
        if (dyg.isScriptLoaded(url)) {
          cb && cb();
        } else {
          var script = document.createElement("script");
          script.type = "text/javascript";
          script.async = false;
          if (script.readyState) {
            script.onreadystatechange = function () {
              if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                cb && cb();
              }
            };
          } else {
            script.onload = function () {
              cb && cb();
            };
          }
          script.onerror = function () {
            errcb && errcb();
          };
          script.src = url;
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
        }
      } catch (e) {
        console.log(e);
      }
    },
    loadCssAsync: function (url, cb) {
      try {
        if (isCssLoaded(url)) {
          cb && cb();
        } else {
          var script = document.createElement("link");
          script.type = "text/css";
          script.rel = "stylesheet";

          if (script.readyState) {
            script.onreadystatechange = function () {
              if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                cb && cb();
              }
            };
          } else {
            script.onload = function () {
              cb && cb();
            };
          }
          script.href = url;
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
        }
      } catch (e) {
        console.log(e);
      }
    },
    isCssLoaded: function (src) {
      var scripts = document.getElementsByTagName("link");
      for (var i = 0; i < scripts.length; i++)
        if (scripts[i].getAttribute('href') == src) return true;
      return false;
    },
    checkIsEmpty: function (value) {
      if (value !== undefined && value !== null && value != '' && (typeof value !== 'undefined'))
        return false;
      return true;
    },
    generateGuid: function () {
      var guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (o) {
        var n = Math.random() * 16 | 0,
          g = o == "x" ? n : (n & 3 | 8);
        return g.toString(16)
      });
      return guid;
    },
    callMethods: function (objs, i, cb) {
      if (objs.length == 0) {
        cb && cb();
        return;
      }
      if (i === objs.length - 1) {
        objs[i].meth(objs[i].src, function () {
          cb && cb();
        });
      } else {
        objs[i].meth(objs[i].src, function () {
          callMethods(objs, i + 1, cb);
        });
      }
    },
    browserNameVersion: function () {
      var n = navigator.appName,
        ua = navigator.userAgent,
        temp;
      var b = ua.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);
      if (b && (temp = ua.match(/version\/([\.\d]+)/i)) != null) {
        b[2] = temp[1];
      }
      b = b ? [b[1], b[2]] : [n, navigator.appVersion, '-?'];
      return b;
    },
    getEnviroment: function () {
      return document.querySelector("meta[property='og:type']").getAttribute('content');
    },
    fireEvent: function (eventName, eventData) {
      if (!checkIsEmpty(eventName) && !checkIsEmpty(eventData)) {
        var event;
        if (document.createEvent) {
          event = document.createEvent("HTMLEvents");
          event.initEvent(eventName, true, true);
        } else {
          event = document.createEventObject();
          event.eventType = eventName;
        }
        event.eventName = eventName;
        if (document.createEvent) {
          document.dispatchEvent(event);
        } else {
          var eventType = '';
          if (ieIE)
            eventType = "on" + event.eventType
          else
            eventType = event.eventType;
          document.fireEvent(eventType, event);
        }
      }
    }
  }

};
