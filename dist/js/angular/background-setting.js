(function () {
  "use strict";

  angular.module("risevision.widget.common.background-setting",
    ["risevision.common.i18n", "risevision.widget.common.color-picker"])
    .directive("backgroundSetting", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          background: "="
        },
        template: $templateCache.get("_angular/background-setting/background-setting.html"),
        link: function ($scope) {
          $scope.defaultSetting = {
            color: "transparent"
          };

          $scope.defaults = function(obj) {
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

          $scope.$watch("background", function(background) {
            $scope.defaults(background, $scope.defaultSetting);
          });
        }
      };
    }]);
}());

(function(module) {
try { module = angular.module("risevision.widget.common.background-setting"); }
catch(err) { module = angular.module("risevision.widget.common.background-setting", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/background-setting/background-setting.html",
    "<div class=\"section\">\n" +
    "  <h5>{{\"background.heading\" | translate}}</h5>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label>{{\"background.color.label\" | translate}}  &nbsp;</label>\n" +
    "    <div>\n" +
    "      <input color-picker color=\"background.color\" type=\"background\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
