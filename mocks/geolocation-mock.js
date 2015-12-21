(function (window) {
  "use strict";

    if (typeof navigator === "undefined" || navigator === null) {
      window.navigator = {};
    }

    if (!("geolocation" in navigator)) {
      window.navigator.geolocation = {};
    }

    navigator.geolocation.getCurrentPosition = function(success, error) {
      if (success && typeof(success) === "function") {
        success({
          "coords": {
            "latitude": 52.5168,
            "longitude": 13.3889,
            "accuracy": 1500
          }
        });
      }
    };
})(window);
