/* global WIDGET_COMMON_CONFIG */

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.Background = function (data) {
  "use strict";

  var _callback = null,
    _ready = false,
    _background = null,
    _storage = null,
    _refreshDuration = 900000, // 15 minutes
    _isStorageFile = false,
    _separator = "";

  /*
   * Private Methods
   */
  function _refreshTimer() {
    setTimeout(function backgroundRefresh() {
      _background.style.backgroundImage = "url(" + data.background.image.url + _separator + "cb=" + new Date().getTime() + ")";
      _refreshTimer();
    }, _refreshDuration);
  }

  function _backgroundReady() {
    _ready = true;

    if (data.background.useImage && !_isStorageFile) {
      // start the refresh poll for non-storage background image
      _refreshTimer();
    }

    if (_callback && typeof _callback === "function") {
      _callback();
    }
  }

  function _configure() {
    var str;

    _background = document.getElementById("background");
    _storage = document.getElementById("backgroundStorage");

    // set the document background
    document.body.style.background = data.background.color;

    if (_background) {
      if (data.background.useImage) {
        _background.className = data.background.image.position;
        _background.className = data.background.image.scale ? _background.className + " scale-to-fit"
          : _background.className;

        _isStorageFile = (Object.keys(data.backgroundStorage).length !== 0);

        if (!_isStorageFile) {
          str = data.background.image.url.split("?");

          // store this for the refresh timer
          _separator = (str.length === 1) ? "?" : "&";

          _background.style.backgroundImage = "url(" + data.background.image.url + ")";
          _backgroundReady();
        } else {
          if (_storage) {
            // Rise Storage
            _storage.addEventListener("rise-storage-response", function (e) {
              if (!_ready) {
                if (e.detail && e.detail.url) {
                  // Escape single quotes.
                  _background.style.backgroundImage = "url('" + e.detail.url.replace("'", "\\'") + "')";
                }

                _backgroundReady();
              } else {
                if (e.detail && e.detail.url) {
                  // check for "changed" property and ensure it is true
                  if (e.detail.hasOwnProperty("changed") && e.detail.changed) {
                    // Escape single quotes.
                    _background.style.backgroundImage = "url('" + e.detail.url.replace("'", "\\'") + "')";
                  }
                }
              }
            });

            _storage.setAttribute("folder", data.backgroundStorage.folder);
            _storage.setAttribute("fileName", data.backgroundStorage.fileName);
            _storage.setAttribute("companyId", data.backgroundStorage.companyId);
            _storage.setAttribute("env", WIDGET_COMMON_CONFIG.STORAGE_ENV);
            _storage.go();
          } else {
            console.log("Missing element with id value of 'backgroundStorage'");
          }
        }
      } else {
        _backgroundReady();
      }
    } else {
      console.log("Missing element with id value of 'background'");
    }
  }

  /*
   *  Public Methods
   */
  function init(cb) {
    if (!_ready) {
      if (cb) {
        _callback = cb;
      }

      _configure();

    } else if (cb && typeof cb === "function") {
      cb();
    }
  }

  return {
    "init": init
  };
};
