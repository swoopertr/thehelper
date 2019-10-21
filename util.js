helper ={
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
      }

};