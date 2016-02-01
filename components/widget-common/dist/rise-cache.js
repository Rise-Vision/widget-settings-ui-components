var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.RiseCache = (function () {
  "use strict";

  var BASE_CACHE_URL = "//localhost:9494/";

  var _pingReceived = false,
    _isCacheRunning = false;

  function ping(callback) {
    var r = new XMLHttpRequest();

    if (!callback || typeof callback !== "function") {
      return;
    }

    r.open("GET", BASE_CACHE_URL + "ping?callback=_", true);
    r.onreadystatechange = function () {
      try {
        if (r.readyState === 4 ) {
          // save this result for use in getFile()
          _pingReceived = true;

          if(r.status === 200){
            _isCacheRunning = true;

            callback(true, r.responseText);
          } else {
            console.debug("Rise Cache is not running");
            _isCacheRunning = false;

            callback(false, null);
          }
        }
      }
      catch (e) {
        console.debug("Caught exception: ", e.description);
      }

    };
    r.send();
  }

  function getFile(fileUrl, callback, nocachebuster) {
    if (!fileUrl || !callback || typeof callback !== "function") {
      return;
    }

    function fileRequest() {
      var url, str, separator;

      if (_isCacheRunning) {
        // configure url with cachebuster or not
        url = (nocachebuster) ? BASE_CACHE_URL + "?url=" + encodeURIComponent(fileUrl) :
        BASE_CACHE_URL + "cb=" + new Date().getTime() + "?url=" + encodeURIComponent(fileUrl);
      } else {
        if (nocachebuster) {
          url = fileUrl;
        } else {
          str = fileUrl.split("?");
          separator = (str.length === 1) ? "?" : "&";
          url = fileUrl + separator + "cb=" + new Date().getTime();
        }
      }

      makeRequest("HEAD", url);
    }

    function makeRequest(method, url) {
      var xhr = new XMLHttpRequest(),
        request = {
          xhr: xhr,
          url: url
        };

      if (_isCacheRunning) {
        xhr.open(method, url, true);

        xhr.addEventListener("loadend", function () {
          var status = xhr.status || 0;

          if (status >= 200 && status < 300) {
            callback(request);
          } else {
            // Server may not support HEAD request. Fallback to a GET request.
            if (method === "HEAD") {
              makeRequest("GET", url);
            } else {
              callback(request, new Error("The request failed with status code: " + status));
            }
          }
        });

        xhr.send();
      }
      else {
        // Rise Cache is not running (preview), skip HEAD request and execute callback immediately
        callback(request);
      }

    }

    if (!_pingReceived) {
      /* jshint validthis: true */
      return this.ping(fileRequest);
    } else {
      return fileRequest();
    }

  }

  return {
    getFile: getFile,
    ping: ping
  };

})();
