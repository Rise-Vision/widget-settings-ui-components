(function () {
  "use strict";

  angular.module("risevision.widget.common.transition-setting", [
      "risevision.common.i18n", "risevision.widget.common.tooltip"])
    .directive("transitionSetting", ["$templateCache", "$log", function ($templateCache/*, $log*/) {
      return {
        restrict: "E",
        scope: {
          transition: "=",
          hideFade: "@"
        },
        template: $templateCache.get("_angular/transition-setting/transition-setting.html"),
        link: function (scope) {

          scope.defaultSetting = {
            by: "none",
            duration: 10,
            pud: 10,
            resume: 5,
            speed: "medium"
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

          scope.$watch("transition", function(transition) {
            scope.defaults(transition, scope.defaultSetting);
          });

        }
      };
    }]);
}());
