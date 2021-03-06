(function () {
  "use strict";

  angular.module("risevision.widget.common.background-image-setting", [
    "risevision.common.i18n",
    "colorpicker.module",
    "risevision.widget.common.file-selector",
    "risevision.widget.common.position-setting",
    "risevision.widget.common.background-image"
  ])
    .directive("backgroundImageSetting", ["$templateCache", "$log", function ($templateCache/*, $log*/) {
      return {
        restrict: "E",
        scope: {
          background: "=",
          companyId: "@",
          colorParentContainerClass: "=",
          colorContainerClass: "=",
          positionParentContainerClass: "=",
          positionContainerClass: "="
        },
        template: $templateCache.get("_angular/background-image-setting/background-image-setting.html"),
        link: function (scope) {

          scope.defaultSetting = {
            // color: "" this needs to be set as a default in the parents "background" model
            useImage: false,
            image: {
              selector: {},
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

          scope.$watch("background.image.selector.url", function (newUrl) {
            if (scope.imageUrl !== newUrl) {
              scope.imageUrl = newUrl;
            }
          });

          scope.$on("backgroundImageLoad", function (event, loaded) {
            scope.$apply(function () {
              scope.imageLoaded = loaded;
            });

          });

          scope.$on("urlFieldBlur", function () {
            scope.imageUrl = scope.background.image.selector.url;
          });

        }
      };
    }]);
}());
