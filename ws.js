helper={
    WebSocket: {
    ws: undefined,
    isSupported: function () {
      return !!window.WebSocket;
    },
    keepAlive: function () {
      if (helper.Objects.webSocket) {
        if (helper.Objects.webSocket.readyState === helper.Objects.webSocket.OPEN) {
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
  }};