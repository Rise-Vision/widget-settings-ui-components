var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.WSClient = (function() {

  function broadcastMessage(message) {
    safeWrite(message);
  }

  function canConnect() {
    try {
      if (top.RiseVision.Viewer.LocalMessaging) {
        return top.RiseVision.Viewer.LocalMessaging.canConnect();
      }
    } catch (err) {
      console.log( "widget-common: ws-client", err );
    }
  }

  function getModuleClientList() {
    safeWrite({topic: "client-list-request"});
  }

  function receiveMessages(handler) {
    if (!handler || typeof handler !== "function") {return;}

    try {
      if (top.RiseVision.Viewer.LocalMessaging) {
        top.RiseVision.Viewer.LocalMessaging.receiveMessages(handler);
      }
    } catch (err) {
      console.log( "widget-common: ws-client", err );
    }
  }

  function safeWrite(message) {
    try {
      if (top.RiseVision.Viewer.LocalMessaging) {
        top.RiseVision.Viewer.LocalMessaging.write(message);
      }
    } catch (err) {
      console.log( "widget-common: ws-client", err );
    }
  }

  return {
    broadcastMessage: broadcastMessage,
    canConnect: canConnect,
    getModuleClientList: getModuleClientList,
    receiveMessages: receiveMessages
  };
})();