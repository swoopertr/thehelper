helper= {
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
  }
};