(function () {
  "use strict";

  angular.module("risevision.widget.common.font-setting")
    .factory("googleFontLoader", ["$http", "angularLoad", function($http, angularLoad) {

    var fontsApi = "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBXxVK_IOV7LNQMuVVo_l7ZvN53ejN86zY",
      fontBaseUrl = "//fonts.googleapis.com/css?family=",
      exclude = ["Buda", "Coda Caption", "Open Sans Condensed", "UnifrakturCook", "Molle"],
      fallback = ",sans-serif;",
      factory = {};

    factory.getFonts = function() {
      return $http.get(fontsApi, { cache: true })
        .then(function(response) {
          var family = "", fonts = "", spaces = false;

          if (response.data && response.data.items) {
            for (var i = 0; i < response.data.items.length; i++) {
              family = response.data.items[i].family;

              if (exclude.indexOf(family) === -1) {
                angularLoad.loadCSS(fontBaseUrl + family).then(function() {
                  // Font loaded.
                });

                // check for spaces in family name
                if (/\s/.test(family)) {
                  spaces = true;
                }

                if (spaces) {
                  // wrap family name in single quotes
                  fonts += family + "='" + family + "'" + fallback;
                }
                else {
                  fonts += family + "=" + family + fallback;
                }

              }
            }
          }

          return fonts;
        });
    };

    return factory;
  }]);
}());
