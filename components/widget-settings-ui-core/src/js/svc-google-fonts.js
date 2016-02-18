angular.module("risevision.widget.common")
  .factory("googleFontLoader", ["$http", function ($http) {
    var factory = {
      getPopularFonts: function() {
        return $http.get("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBXxVK_IOV7LNQMuVVo_l7ZvN53ejN86zY&sort=popularity",
          { cache: true });
      }
    };

    return factory;
  }]);
