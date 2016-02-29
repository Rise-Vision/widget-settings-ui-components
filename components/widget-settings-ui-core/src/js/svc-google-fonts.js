angular.module("risevision.widget.common")
  .factory("googleFontLoader", ["$http", function ($http) {
    var factory = {
      getGoogleFonts: function() {
        return $http.get("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBXxVK_IOV7LNQMuVVo_l7ZvN53ejN86zY&sort=alpha",
          { cache: true });
      }
    };

    return factory;
  }]);
