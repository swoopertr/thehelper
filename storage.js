helper = {
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
      }

};