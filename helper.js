var helper = {
  Objects: {
    timerID: 0
  },
  Config: {
    webSocketTimeout: 15000,
    xhrTimeout: 30,
  },
  Route: {
    routes: [],
    clickHandler: function (e) {
      e.preventDefault();
      var url = this.getAttribute('href');
      helper.Event.pub('history.event.change', url);
    },
    addRoute: function (route, name, fn) {
      helper.Route.routes.push({ 'route': route, 'name': name, 'fn': fn });
    },
    init: function () {
      helper.Event.sub('history.event.change', helper.Route.changed);
      helper.Event.bindLive('a', 'click', helper.Route.clickHandler);
      console.log('route initialized');
    },
    configure: function () {
      helper.Route.addRoute('/', 'home', helper.Route.Module.inject);
      helper.Route.addRoute('/news', 'news', helper.Route.Module.inject);
    },
    loader: function (url) {
      var routeArr = url.split('?');
      var qsObj = helper.QueryString.getParams(url);
      for (var i = 0; i < helper.Route.routes.length; i++) {
        if (helper.Route.routes[i].hasOwnProperty('route')) {
          if (helper.Route.routes[i].route === routeArr[0]) {
            if (qsObj) {
              helper.Route.routes[i].fn(helper.Route.routes[i].name, qsObj);
            } else {
              helper.Route.routes[i].fn(helper.Route.routes[i].name);
            }
            break;
          }
        }
      }
    },
    changed: function (url) {
      history.pushState(null, null, url);
      console.log(url);
      helper.Route.loader(url);

    },
    Module: {
      inject: function (name, prms) {
        var scriptName = "modules/" + name + ".js";
        if (!helper.Ajax.isScriptLoaded(scriptName)) {
          helper.Ajax.loadScriptAsync(scriptName, function () {
            if (!helper.Util.isEmpty(prms)) {
              eval(name + ".init(" + JSON.stringify(prms) + ")")
            } else {
              eval(name + ".init();");
            }
          });
        } else {
          if (!helper.Util.isEmpty(prms)) {
            eval(name + ".init(" + JSON.stringify(prms) + ")")
          } else {
            eval(name + ".init();");
          }
        }
      }
    }
  },
  SelectDom: {
    getById: function (id) {
      return document.getElementById(id);
    },
    getByClass: function (cName) {
      return document.getElementsByClassName(cName);
    }
  },
  Ajax: {
    isScriptLoaded: function (src) {
      var scripts = document.getElementsByTagName("script");
      for (var i = 0; i < scripts.length; i++)
        if (scripts[i].getAttribute('src') == src) return true;
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
        if (scripts[i].getAttribute('href') == src) return true;
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
        if (xhr.readyState > 3 && xhr.status == 200) {
          cb && cb(xhr.responseText);
        }
      };
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(params);
      return xhr;
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
        };
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
  Util: {
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
    arrayUniqneens: function (arr) {
      return arr.filter(function (item, index) {
        return arr.indexOf(item) >= index;
      });
    },
    disableRightClick: function(){
      document.addEventListener('contextmenu', function(e){
        e.preventDefault();
      });


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
      elem = elem[0];
      var x = 0;
      while(elem){
         x += elem.offsetTop;
         elem = elem.offsetParent;
      }
      window.scroll(0, x - 80);
  }
},
  Manipulation: {
    createElement: function (options) {
      var el
        , a
        , i
      if (!options.tagName) {
        el = document.createDocumentFragment()
      }
      else {
        el = document.createElement(options.tagName)
        if (options.className) {
          el.className = options.className
        }

        if (options.attributes) {
          for (a in options.attributes) {
            el.setAttribute(a, options.attributes[a])
          }
        }

        if (options.html !== undefined) {
          el.innerHTML = options.html
        }
      }

      if (options.text) {
        el.appendChild(document.createTextNode(options.text))
      }

      if (window.HTMLElement === undefined) {
        window.HTMLElement = Element
      }

      if (options.childs && options.childs.length) {
        for (i = 0; i < options.childs.length; i++) {
          el.appendChild(options.childs[i] instanceof window.HTMLElement ? options.childs[i] : helper.Manipulation.createElement(options.childs[i]))
        }
      }
      return el
    },
    removeElement: function (element) {
      element.parentNode.removeChild(element);
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
      if (parts.length == 2) return parts.pop().split(";").shift();
    },
    remove: function (name) {
      document.cookie = name + '=; Max-Age=-99999999;';
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
  Adblock: function (cb) {
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
      console.log('AdBlock Enabled? ', adBlockEnabled)
      cb && cb();
    }, 100);
  },
  WebSocket: {
    ws: undefined,
    isSupported: function () {
      return !!window.WebSocket;
    },
    keepAlive: function () {
      if (helper.Objects.webSocket) {
        if (helper.Objects.webSocket.readyState == helper.Objects.webSocket.OPEN) {
          helper.Objects.webSocket.send('');
        }
        helper.Objects.timerID = setTimeout(helper.WebSocket.keepAlive, helper.Config.webSocketTimeout);
      }
    },
    getState: function () {
      return helper.WebSocket.ws.state;
    },
    open: function (wsUrl, cb) {
      helper.WebSocket.ws = new WebSocket(wsUrl);
      helper.WebSocket.ws.onmessage = helper.WebSocket.messageReceived;
      helper.WebSocket.ws.onclose = helper.WebSocket.closeCallback;
      helper.WebSocket.ws.onerror = helper.WebSocket.error;
      helper.WebSocket.ws.onopen = function (evt) {
        helper.WebSocket.onOpen(evt);
        cb && cb();
      };
    },
    onOpen: function (evt) {
      console.log("WebSocket conntection status: " + evt.srcElement.readyState);
    },
    closeConnection: function () {
      if (typeof helper.WebSocket.ws !== 'undefined') {
        helper.WebSocket.ws.close();
        console.log('websocket closed');
      }
    },
    closeCallback: function (cb) {
      if (typeof helper.WebSocket.ws !== 'undefined') {
        cb && cb();
      }
    },
    messageReceived: function (evt) {
      if (typeof helper.WebSocket.ws !== 'undefined') {
        console.log("Server : " + evt.data);
      }
    },
    messageSend: function (msg) {
      if (typeof helper.WebSocket.ws !== 'undefined') {
        helper.WebSocket.ws.send(msg);
      }
    },
    error: function (evt) {
      console.log("Socket error :" + evt.data);
    }

  }
};


//this init the route core.
//helper.Route.init();
//helper.Route.configure();
