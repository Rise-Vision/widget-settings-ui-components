var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.RiseCache = (function () {
  "use strict";

  var BASE_CACHE_URL = "http://localhost:9494/";

  var _pingReceived = false,
    _isCacheRunning = false,
    _isV2Running = false,
    _isHttps = true,
    _utils = RiseVision.Common.Utilities,
    _RC_VERSION_WITH_ENCODE = "1.7.3",
    _RC_VERSION = "";

  function ping(callback) {
    var r = new XMLHttpRequest(),
      /* jshint validthis: true */
      self = this;

    if (!callback || typeof callback !== "function") {
      return;
    }

    if (!_isV2Running) {
      r.open("GET", BASE_CACHE_URL + "ping?callback=_", true);
    }
    else {
      r.open("GET", BASE_CACHE_URL, true);
    }

    r.onreadystatechange = function () {
      try {
        if (r.readyState === 4 ) {
          // save this result for use in getFile()
          _pingReceived = true;

          if(r.status === 200) {
            _isCacheRunning = true;

            try {
              var responseObject = (r.responseText) ? JSON.parse(r.responseText) : "";
              if (responseObject) {
                _RC_VERSION = responseObject.version;
              }
            }
            catch(e) {
              console.log(e);
            }

            callback(true, r.responseText);
          } else if (r.status === 404) {
            // Rise Cache V2 is running
            _isV2Running = true;

            BASE_CACHE_URL = "https://localhost:9495/";

            // call ping again so correct ping URL is used for Rise Cache V2
            return self.ping(callback);
          } else {

            if ( _isHttps ) {
              _isV2Running = true;
              _isHttps = false;
              BASE_CACHE_URL = "http://localhost:9494/";

              // call ping again so correct ping URL is used for Rise Cache V2 HTTPs
              return self.ping(callback);
            } else {
              console.debug("Rise Cache is not running");
              _isV2Running = false;
              _isCacheRunning = false;

              callback(false, null);
            }
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

    var totalCacheRequests = 0;

    function fileRequest() {
      var url, str, separator;

      if (_isCacheRunning) {
        if (_isV2Running) {
          if ( _compareVersionNumbers( _RC_VERSION, _RC_VERSION_WITH_ENCODE ) > 0 ) {
            url = BASE_CACHE_URL + "files?url=" + fileUrl;
          } else {
            url = BASE_CACHE_URL + "files?url=" + encodeURIComponent(fileUrl);
          }
        } else {
          // configure url with cachebuster or not
          url = (nocachebuster) ? BASE_CACHE_URL + "?url=" + encodeURIComponent(fileUrl) :
          BASE_CACHE_URL + "cb=" + new Date().getTime() + "?url=" + encodeURIComponent(fileUrl);
        }
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

    function _compareVersionNumbers( v1, v2 ) {
      var v1parts = v1.split( "." ),
        v2parts = v2.split( "." ),
        i = 0;

      function isPositiveInteger( x ) {
        return /^\d+$/.test( x );
      }

      // First, validate both numbers are true version numbers
      function validateParts( parts ) {
        for ( i = 0; i < parts.length; i++ ) {
          if ( !isPositiveInteger( parts[ i ] ) ) {
            return false;
          }
        }
        return true;
      }
      if ( !validateParts( v1parts ) || !validateParts( v2parts ) ) {
        return NaN;
      }

      for ( i = 0; i < v1parts.length; ++i ) {
        if ( v2parts.length === i ) {
          return 1;
        }

        if ( v1parts[ i ] === v2parts[ i ] ) {
          continue;
        }
        if ( v1parts[ i ] > v2parts[ i ] ) {
          return 1;
        }
        return -1;
      }

      if ( v1parts.length !== v2parts.length ) {
        return -1;
      }

      return 0;
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
          if (status === 202) {
              totalCacheRequests++;
              if (totalCacheRequests < 3) {
                setTimeout(function(){ makeRequest(method, url); }, 3000);
              } else {
                  callback(request, new Error("File is downloading"));
              }
          } else if (status >= 200 && status < 300) {
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

  function getErrorMessage(statusCode) {
    var errorMessage = "";
    switch (statusCode) {
      case 502:
        errorMessage = "There was a problem retrieving the file.";
        break;
      case 504:
        errorMessage = "Unable to download the file. The server is not responding.";
        break;
      case 507:
        errorMessage = "There is not enough disk space to save the file on Rise Cache.";
        break;
      case 534:
        errorMessage = "The file does not exist or cannot be accessed.";
        break;
      default:
        errorMessage = "";
    }

    return errorMessage;
  }

  function isRiseCacheRunning(callback) {
    if (!callback || typeof callback !== "function") {
      return;
    }

    if (!_pingReceived) {
      /* jshint validthis: true */
      return this.ping(function () {
        callback(_isCacheRunning);
      });
    } else {
      callback(_isCacheRunning);
    }
  }

  function isV2Running(callback) {
    if (!callback || typeof callback !== "function") {
      return;
    }

    if (!_pingReceived) {
      /* jshint validthis: true */
      return this.ping(function () {
        callback(_isV2Running);
      });
    }
    else {
      callback(_isV2Running);
    }
  }

  function isRCV2Player(callback) {
    if (!callback || typeof callback !== "function") {
      return;
    }
    /* jshint validthis: true */
    return this.isV2Running(function (isV2Running) {
      if (isV2Running) {
        callback(isV2Running);
      } else {
        callback(isV3PlayerVersionWithRCV2());
      }
    });
  }

  function isV3PlayerVersionWithRCV2() {
    var RC_V2_FIRST_PLAYER_VERSION_DATE = _utils.getDateObjectFromPlayerVersionString("2016.10.10.00.00");

    var sysInfoViewerParameter = _utils.getQueryParameter("sysInfo");
    if (!sysInfoViewerParameter) {
      // when the widget is loaded into an iframe the search has a parameter called parent which represents the parent url
      var parentParameter = _utils.getQueryParameter("parent");
      sysInfoViewerParameter = _utils.getQueryStringParameter("sysInfo", parentParameter);
    }
    if (sysInfoViewerParameter) {
      var playerVersionString = _utils.getQueryStringParameter("pv", sysInfoViewerParameter);
      var playerVersionDate = _utils.getDateObjectFromPlayerVersionString(playerVersionString);
      return playerVersionDate >= RC_V2_FIRST_PLAYER_VERSION_DATE;
    } else {
      return false;
    }
  }

  function reset() {
    _pingReceived = false;
     _isCacheRunning = false;
     _isV2Running = false;
     _isHttps = true;
    BASE_CACHE_URL = "http://localhost:9494/";
  }

  return {
    getErrorMessage: getErrorMessage,
    getFile: getFile,
    isRiseCacheRunning: isRiseCacheRunning,
    isV2Running: isV2Running,
    isRCV2Player: isRCV2Player,
    ping: ping,
    reset: reset
  };

})();
