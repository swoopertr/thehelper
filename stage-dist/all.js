helper ={
  Cookie: {
    add: function (name, value, minutes) {
      var expires = "";
      if (minutes) {
        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    },
    get: function (name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length === 2) return parts.pop().split(";").shift();
    },
    remove: function (name) {
      document.cookie = name + '=; Max-Age=-99999999;';
    }
  },
  Event: {
    events: {},
    sub: function (eventName, fn) {
      helper.Event.events[eventName] = helper.Event.events[eventName] || [];
      helper.Event.events[eventName].push(fn);
    },
    remove: function (eventName, fn) {
      if (helper.Event.events[eventName]) {
        for (var i = 0; i < helper.Event.events[eventName].length; i++) {
          if (helper.Event.events[eventName][i] === fn) {
            helper.Event.events[eventName].splice(i, 1);
            break;
          }
        }
      }
    },
    pub: function (eventName, data) {
      if (helper.Event.events[eventName]) {
        helper.Event.events[eventName].forEach(function (fn) {
          fn(data);
        });
      }
    },
    clear: function () {
      delete helper.Event.events;
      helper.Event.events = {};
    },
    trigger: function (eventName) {
      var event = document.createEvent(eventName);
      event.initEvent(eventName, true, true);
      window.dispatchEvent(event);
    },
    bindLive: function (selector, event, cb, cnx) {
      helper.Event.addEvent(cnx || document, event, function (e) {
        var qs = (cnx || document).querySelectorAll(selector);
        if (qs) {
          var el = e.target || e.srcElement, index = -1;
          while (el && ((index = Array.prototype.indexOf.call(qs, el)) === -1)) el = el.parentElement;
          if (index > -1) cb.call(el, e);
        }
      });
    },
    addEvent: function (el, type, fn) {
      if (el.attachEvent) el.attachEvent('on' + type, fn); else el.addEventListener(type, fn);
    }
  },
  Objects: {
    timerID: 0
  },
  Config: {
    webSocketTimeout: 15000,
    xhrTimeout: 30,
  },  
  SelectDom: {
    getById: function (id) {
      return document.getElementById(id);
    },
    getByClass: function (cName) {
      return document.getElementsByClassName(cName);
    }
  },
  QueryString: {
    build: function (data) {
      if (typeof (data) === 'string') return data;
      var query = [];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
      }
      return query.join('&');
    },
    getParams: function (url) {
      var params = {};
      var parser = document.createElement('a');
      parser.href = url || window.location.href;
      var query = parser.search.substring(1);
      var vars = query.split('&');
      if (vars.length < 2) return params;
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }
      return params;
    }
  },
  Ajax: {
    isScriptLoaded: function (url) {
      var scripts = document.getElementsByTagName("script");
      for (var i = 0; i < scripts.length; i++)
        if (scripts[i].getAttribute('src') === url) return true;
      return false;
    },
    loadScriptAsync: function (url, cb) {
      try {
        if (helper.Ajax.isScriptLoaded(url)) {
          cb && cb();
        } else {
          var script = document.createElement("script");
          script.type = "text/javascript";
          script.async = false;
          if (script.readyState) {
            script.onreadystatechange = function () {
              if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
                cb && cb();
              }
            };
          } else {
            script.onload = function () {
              cb && cb();
            };
          }
          script.src = url;
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
        }
      } catch (e) {
        console.log(e);
      }
    },
    isCssLoaded: function (src) {
      var scripts = document.getElementsByTagName("link");
      for (var i = 0; i < scripts.length; i++)
        if (scripts[i].getAttribute('href') === src) return true;
      return false;
    },
    loadCssAsync: function (url, cb) {
      try {
        if (helper.Ajax.isCssLoaded(url)) {
          cb && cb();
        } else {
          var script = document.createElement("link");
          script.type = "text/css";
          script.rel = "stylesheet";

          if (script.readyState) {
            script.onreadystatechange = function () {
              if (script.readyState === "loaded" || script.readyState === "complete") {
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
    GetReq: function (url, cb) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status >= 200 && xhr.status < 300) {
          cb && cb();
        } else {
          console.log('The request failed!');
        }
      };
      xhr.open('GET', url);
      xhr.send();
    },
    PostReq: function (url, data, cb) {
      var params = typeof data == 'string' ? data : Object.keys(data).map(
        function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }).join('&');

      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
      xhr.open('POST', url);
      xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status === 200) {
          cb && cb(xhr.responseText);
        }
      };
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(params);
      return xhr;
    }
  },
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
  },
  sound_player : {
    audio_object: undefined,
    load_sound: function(url, cb) {
        this.audio_object = new Audio(url);
        this.audio_object.addEventListener('loadeddata', () => {
            cb && cb();
          })
    },
    play_sound: function() {
        this.audio_object.play();
    },
    pause_sound: function() {
        thid.audio_object.pause();
    },
    stop_sound: function() {
        this.audio_object.pause();
        this.audio_object.currentTime = 0;
    },
    set_volume: function(volume) {
        this.audio_object.volume = volume;
    },
    mute_sound: function() {
        this.audio_object.volume = 0;
    }
  },
  Storage: {
    local: {
      insert: function (key, value) {
        localStorage.setItem(key, value);
      },
      remove: function (key) {
        localStorage.removeItem(key);
      },
      get: function (key) {
        return localStorage.getItem(key);
      },
      list: function () {
        var values = [];
        var keys = Object.keys(localStorage);
        var i = keys.length;
        while (i--) {
          values.push(localStorage.getItem(keys[i]));
        }
        return values;
      },
      clear: function () {
        localStorage.clear();
      }
    },
    session: {
      insert: function (key, value) {
        sessionStorage.setItem(key, value);
      },
      remove: function (key) {
        sessionStorage.removeItem(key);
      },
      get: function (key) {
        return sessionStorage.getItem(key);
      },
      list: function () {
        var values = [];
        var keys = Object.keys(sessionStorage);
        var i = keys.length;
        while (i--) {
          values.push(sessionStorage.getItem(keys[i]));
        }
        return values;
      },
      clear: function () {
        sessionStorage.clear();
      }
    }
  },
  Util: {
    removeElement: function (element) {
      element.parentNode.removeChild(element);
    },
    insertAfter: function(el, strHtml){
      el.insertAdjacentHTML('afterend', strHtml);
    },
    isInIframe: function(){
      return window.location !== window.parent.location;
    },
    getProperties: function (jsObj) {
      return Object.keys(jsObj);
    },
    isEmpty: function (jsObj) {
      for (var key in jsObj) {
        if (jsObj.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    },
    domReady: function (cb) {
      if (typeof cb !== 'function') return;
      if (document.readyState === 'interactive' ||
        document.readyState === 'complete') {
        return cb();
      }
      document.addEventListener('DOMContentLoaded', cb, false);
    },  
    disableRightClick: function(){
      document.addEventListener('contextmenu', function(e){
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
    }
  },

};

String.prototype.trim = function () {
  return this.replace(/^s+|s+$/g, "");
};
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.removeNonASCII = function(){
  return this.replace(/[^\x20-\x7E]/g, '');
};
String.prototype.stripHTMLTags = function(){
  return this.replace(/<[^>]*>/g, '');
};

helper.init();