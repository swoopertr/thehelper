var helper = {
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
        getByClass: function (className) {
            return document.getElementsByClassName(className);
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
    }
};

let exTimer = setInterval(() => {
    if (helper.init) {
        helper.init();
        clearInterval(exTimer);
    }
}, 200)
