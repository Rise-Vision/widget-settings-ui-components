(function () {
  "use strict";

  angular.module("risevision.widget.common.background-image-setting", [
    "risevision.common.i18n",
    "colorpicker.module",
    "risevision.widget.common.url-field",
    "risevision.widget.common.position-setting",
    "risevision.widget.common.background-image"
  ])
    .directive("backgroundImageSetting", ["$templateCache", "$log", function ($templateCache/*, $log*/) {
      return {
        restrict: "E",
        scope: {
          background: "=",
          companyId: "@"
        },
        template: $templateCache.get("_angular/background-image-setting/background-image-setting.html"),
        link: function (scope) {

          scope.defaultSetting = {
            color: "rgba(255,255,255,0)",
            useImage: false,
            image: {
              url: "",
              position: "top-left",
              scale: true
            }
          };

          scope.defaults = function(obj) {
            if (obj) {
              for (var i = 1, length = arguments.length; i < length; i++) {
                var source = arguments[i];

                for (var prop in source) {
                  if (obj[prop] === void 0) {
                    obj[prop] = source[prop];
                  }
                }
              }
            }
            return obj;
          };

          scope.imageLoaded = false;
          scope.imageUrl = "";

          scope.$watch("background", function(background) {
            scope.defaults(background, scope.defaultSetting);
          });

          scope.$watch("background.image.url", function (newUrl, oldUrl) {
            /* In the context of being used in a widget settings, this scenario happens only once when settings
             initialize and have previously been saved. This will trigger the image to load/display.
             */
            if (newUrl !== "" && typeof oldUrl === "undefined") {
              scope.imageUrl = newUrl;
            }
          });

          scope.$on("backgroundImageLoad", function (event, loaded) {
            scope.$apply(function () {
              scope.imageLoaded = loaded;
            });

          });

          scope.$on("urlFieldBlur", function () {
            scope.imageUrl = scope.background.image.url;
          });

        }
      };
    }]);
}());

(function () {
  "use strict";

  angular.module("risevision.widget.common.background-image", [])
    .directive("backgroundImage", ["$log", function (/*$log*/) {
      return {
        restrict: "A",
        link: function(scope, element) {
          element.bind("load", function() {
            scope.$emit("backgroundImageLoad", true);
          });

          element.bind("error", function () {
            scope.$emit("backgroundImageLoad", false);
          });
        }
      };
    }]);
}());

(function(module) {
try { module = angular.module("risevision.widget.common.background-image-setting"); }
catch(err) { module = angular.module("risevision.widget.common.background-image-setting", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/background-image-setting/background-image-setting.html",
    "<!-- Color -->\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-3\">\n" +
    "      <div class=\"input-group\">\n" +
    "        <input class=\"form-control\" colorpicker=\"rgba\" colorpicker-parent=\"true\" background-setting type=\"text\" ng-model=\"background.color\">\n" +
    "        <span class=\"input-group-addon color-wheel\"></span>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<!-- Image Choice -->\n" +
    "<div class=\"checkbox\">\n" +
    "  <label>\n" +
    "    <input name=\"choice\" type=\"checkbox\" ng-model=\"background.useImage\"> {{\"background.choice\" | translate}}\n" +
    "  </label>\n" +
    "</div>\n" +
    "<div id=\"backgroundImageControls\" ng-if=\"background.useImage\">\n" +
    "  <!-- Image Placeholder -->\n" +
    "  <div class=\"form-group\">\n" +
    "    <div ng-if=\"!imageLoaded\" class=\"image-placeholder\">\n" +
    "      <i class=\"fa fa-image\"></i>\n" +
    "    </div>\n" +
    "    <!-- Image -->\n" +
    "    <div ng-show=\"imageLoaded\" class=\"row\">\n" +
    "      <div class=\"col-xs-5 col-sm-3 col-md-2\">\n" +
    "        <img ng-src=\"{{imageUrl}}\" background-image class=\"img-rounded img-responsive\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <!-- Image URL -->\n" +
    "  <url-field id=\"backgroundImageUrl\" url=\"background.image.url\"\n" +
    "             file-type=\"image\"\n" +
    "             hide-label=\"true\"\n" +
    "             company-id=\"{{companyId}}\"\n" +
    "             ng-model=\"urlentry\" valid></url-field>\n" +
    "  <!-- Position -->\n" +
    "  <position-setting position=\"background.image.position\" hide-label=\"true\"></position-setting>\n" +
    "  <!-- Scale to fit -->\n" +
    "  <div class=\"checkbox\">\n" +
    "    <label>\n" +
    "      <input name=\"scale\" type=\"checkbox\" ng-model=\"background.image.scale\"> {{\"background.image.scale\" | translate}}\n" +
    "    </label>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
})();
