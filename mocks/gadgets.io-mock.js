(function (window) {
  "use strict";

  gadgets.io = gadgets.io || {};

  gadgets.io.RequestParameters = {
    "CONTENT_TYPE": "CONTENT_TYPE",
    "GET_SUMMARIES": "GET_SUMMARIES",
    "HEADERS": "HEADERS",
    "METHOD": "METHOD",
    "NUM_ENTRIES": "NUM_ENTRIES",
    "REFRESH_INTERVAL": "REFRESH_INTERVAL"
  };

  gadgets.io.ContentType = {
    TEXT: "TEXT",
    DOM:  "DOM",
    JSON: "JSON",
    FEED: "FEED"
  };

  window.mockMakeRequest = function(info) {
    return function(url, callback, opt_params) {
      info.url = url;
      info.callback = callback;
      info.params = opt_params;

      info.doCallback = function() {
        var response = {
          data: info.data,
          errors: [],
          rc: 200,
          text: info.text
        };

        info.callback.call(null, response);
      };

      info.doCallback()
    };
  };
})(window);