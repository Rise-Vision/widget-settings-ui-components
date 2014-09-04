(function () {
  "use strict";

  angular.module("risevision.widget.common.scroll-setting",
    ["risevision.widget.common.translate", "risevision.widget.common.tooltip"])
    .directive("scrollSetting", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          scroll: "="
        },
        template: $templateCache.get("_angular/scroll-setting/scroll-setting.html"),
        transclude: false,
        link: function($scope) {
          $scope.defaultSetting = {
            by: "none",
            speed: "medium",
            pause: "5"
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

          $scope.$watch("scroll", function(scroll) {
            $scope.defaults(scroll, $scope.defaultSetting);
          });
        }
      };
    }]);
}());

(function(module) {
try { app = angular.module("risevision.widget.common.scroll-setting"); }
catch(err) { app = angular.module("risevision.widget.common.scroll-setting", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/scroll-setting/scroll-setting.html",
    "<div class=\"section\">\n" +
    "  <div class=\"form-group\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-md-3\">\n" +
    "        <label>{{'scroll.heading' | translate}}</label>\n" +
    "        <select id=\"scroll-by\" ng-model=\"scroll.by\" class=\"form-control\">\n" +
    "          <option value=\"none\">{{'scroll.by.none' | translate}}</option>\n" +
    "          <option value=\"continuous\">{{'scroll.by.continuous' | translate}}</option>\n" +
    "          <option value=\"page\">{{'scroll.by.page' | translate}}</option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div ng-show=\"scroll.by != 'none'\" class=\"more-scroll-options\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"scroll-speed\">{{'scroll.speed.label' | translate}}</label>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "          <select id=\"scroll-speed\" ng-model=\"scroll.speed\" class=\"form-control\">\n" +
    "            <option value=\"slowest\">{{'scroll.speed.slowest' | translate}}</option>\n" +
    "            <option value=\"slow\">{{'scroll.speed.slow' | translate}}</option>\n" +
    "            <option value=\"medium\">{{'scroll.speed.medium' | translate}}</option>\n" +
    "            <option value=\"fast\">{{'scroll.speed.fast' | translate}}</option>\n" +
    "            <option value=\"fastest\">{{'scroll.speed.fastest' | translate}}</option>\n" +
    "          </select>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"scroll-pause\">\n" +
    "        {{'scroll.pause.label' | translate}}\n" +
    "      </label>\n" +
    "      <span popover=\"{{'scroll.pause.tooltip' | translate}}\"\n" +
    "            popover-trigger=\"click\" popover-placement=\"right\" rv-tooltip></span>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "          <div class=\"input-group\">\n" +
    "            <input id=\"scroll-pause\" type=\"text\" ng-model=\"scroll.pause\" class=\"form-control\" />\n" +
    "            <span class=\"input-group-addon\">{{'common.units.seconds' | translate}}</span>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
