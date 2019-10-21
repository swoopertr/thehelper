helper={
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
      }

};