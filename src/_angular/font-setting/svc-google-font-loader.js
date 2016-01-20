(function () {
  "use strict";

  angular.module("risevision.widget.common.font-setting")
    .factory("googleFontLoader", ["$http", "$log", "angularLoad", function($http, $log, angularLoad) {

    var fontsApi = "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBXxVK_IOV7LNQMuVVo_l7ZvN53ejN86zY",
      fontBaseUrl = "http://fonts.googleapis.com/css?family=",
      exclude = ["Buda", "Coda Caption", "Open Sans Condensed", "UnifrakturCook", "Molle"],
      fallback = ",sans-serif;",
      fonts = "",
      factory = {};

    factory.getFonts = function() {
      return $http.get(fontsApi, { cache: true })
        .then(function(response) {
          var family = "";

          if (response.data && response.data.items) {
            for (var i = 0; i < response.data.items.length; i++) {
              family = response.data.items[i].family;

              if (exclude.indexOf(family) === -1) {
                angularLoad.loadCSS(fontBaseUrl + family).then(function() {
                  // Font loaded.
                });

                fonts += family + "=" + family + fallback;
              }
            }
          }

          return fonts;
        });
    };

    return factory;
  }]);
}());
