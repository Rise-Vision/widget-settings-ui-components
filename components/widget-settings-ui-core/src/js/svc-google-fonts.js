angular.module("risevision.widget.common")
  .factory("googleFontLoader", ["$http", "angularLoad", function ($http, angularLoad) {

    var factory = {},
      allFonts = [];

    factory.getGoogleFonts = function() {
      if (allFonts.length === 0) {
        // Get list of Google fonts sorted alphabetically.
        return $http.get("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBXxVK_IOV7LNQMuVVo_l7ZvN53ejN86zY&sort=alpha", { cache: true })
          .then(function(resp) {
            if (resp.data && resp.data.items) {
              // Save all Google fonts.
              for (var i = 0, length = resp.data.items.length; i < length; i++) {
                allFonts.push(resp.data.items[i].family);
              }

              return loadFonts();
            }
          });
      }
      else {
        return loadFonts();
      }
    };

    /* Filter list of fonts to only return those that are Google fonts. */
    factory.getFontsUsed = function(familyList) {
      var fontsUsed = [];

      angular.forEach(allFonts, function (family) {
        if (familyList.indexOf(family) !== -1) {
          fontsUsed.push(family);
        }
      });

      return fontsUsed;
    };

    /* Load the Google fonts. */
    function loadFonts() {
      var family = "",
        fonts = "",
        url = "",
        urls = [],
        spaces = false,
        fallback = ",sans-serif;",
        fontBaseUrl = "//fonts.googleapis.com/css?family=",
        exclude = ["Buda", "Coda Caption", "Open Sans Condensed", "UnifrakturCook", "Molle"];

      for (var i = 0; i < allFonts.length; i++) {
        family = allFonts[i];

        if (exclude.indexOf(family) === -1) {
          url = fontBaseUrl + family;

          angularLoad.loadCSS(url);
          urls.push(url);

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

      return { fonts: fonts, urls: urls };
    }

    return factory;
  }]);
