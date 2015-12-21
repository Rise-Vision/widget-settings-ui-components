(function (window) {
  "use strict";

  var displayId = "",
    companyId = "",
    getIdsCallback,
    throttle = false,
    throttleDelay = 1000,
    lastEvent = "";

  function setIds(names, values) {
    if (Array.isArray(names) && names.length > 0) {
      if (Array.isArray(values) && values.length > 0) {
        if (names[0] === "companyId") {
          companyId = values[0];
        }

        if (names[1] === "displayId") {
          if (values[1]) {
            displayId = values[1];
          }
          else {
            displayId = "preview";
          }
        }

        getIdsCallback(companyId, displayId);
      }
    }
  }

  function isThrottled(event) {
    return throttle && (lastEvent === event);
  }

  if (typeof window.RiseVision === "undefined") {
    window.RiseVision = {};
  }

  if (typeof window.RiseVision.Common === "undefined") {
    window.RiseVision.Common = {};
  }

  if (typeof window.RiseVision.Common.Logger === "undefined") {
    window.RiseVision.Common.LoggerUtils = {};
    window.RiseVision.Common.Logger = {};
  }

  window.RiseVision.Common.LoggerUtils = {
    getIds: function (cb) {
      var id = new window.gadgets.Prefs().getString("id");

      if (!cb || typeof cb !== "function") {
        return;
      }
      else {
        getIdsCallback = cb;
      }

      if (companyId && displayId) {
        getIdsCallback(companyId, displayId);
      }
      else {
        if (id && id !== "") {
          window.gadgets.rpc.register("rsparam_set_" + id, setIds);
          window.gadgets.rpc.call("", "rsparam_get", null, id, ["companyId", "displayId"]);
        }
      }
    },
    getInsertData: function (params) {},
    getFileFormat: function (url) {
      var hasParams = /[?#&]/,
        str;

      if (!url || typeof url !== "string") {
        return null;
      }

      str = url.substr(url.lastIndexOf(".") + 1);

      // don't include any params after the filename
      if (hasParams.test(str)) {
        str = str.substr(0 ,(str.indexOf("?") !== -1) ? str.indexOf("?") : str.length);

        str = str.substr(0, (str.indexOf("#") !== -1) ? str.indexOf("#") : str.length);

        str = str.substr(0, (str.indexOf("&") !== -1) ? str.indexOf("&") : str.length);
      }

      return str.toLowerCase();
    },
    getTable: function (name) {}
  };

  window.RiseVision.Common.Logger = {
    log: function (tableName, params) {
      if (!tableName || !params || !params.event || isThrottled(params.event)) {
        return;
      }

      throttle = true;
      lastEvent = params.event;

      setTimeout(function () {
        throttle = false;
      }, throttleDelay);

      if (params.cb && typeof params.cb === "function") {
        params.cb(null);
      }
    }
  };

})(window);
