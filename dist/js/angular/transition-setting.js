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
            type: "none",
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

(function(module) {
try { module = angular.module("risevision.widget.common.transition-setting"); }
catch(err) { module = angular.module("risevision.widget.common.transition-setting", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/transition-setting/transition-setting.html",
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label\">{{\"transition.heading\" | translate}}</label>\n" +
    "      <select name=\"transition-by\" ng-model=\"transition.type\" class=\"form-control\">\n" +
    "        <option value=\"none\">{{\"transition.type.none\" | translate}}</option>\n" +
    "        <option value=\"fade\" ng-if=\"!hideFade\">{{\"transition.type.fade\" | translate}}</option>\n" +
    "        <option value=\"scroll\">{{\"transition.type.scroll\" | translate}}</option>\n" +
    "        <option value=\"page\">{{\"transition.type.page\" | translate}}</option>\n" +
    "      </select>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-3\" ng-if=\"transition.type === 'fade' || transition.type === 'page'\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label\">{{\"transition.duration\" | translate }}</label>\n" +
    "      <div class=\"input-group\">\n" +
    "        <input name=\"transition-duration\" type=\"number\"  class=\"form-control\" ng-model=\"transition.duration\">\n" +
    "        <span class=\"input-group-addon\">sec</span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-3\" ng-if=\"transition.type === 'scroll'\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label\">{{\"transition.speed.label\" | translate}}</label>\n" +
    "      <select name=\"transition-speed\" ng-model=\"transition.speed\" class=\"form-control\">\n" +
    "        <option value=\"slowest\">{{\"transition.speed.slowest\" | translate}}</option>\n" +
    "        <option value=\"slow\">{{\"transition.speed.slow\" | translate}}</option>\n" +
    "        <option value=\"medium\">{{\"transition.speed.medium\" | translate}}</option>\n" +
    "        <option value=\"fast\">{{\"transition.speed.fast\" | translate}}</option>\n" +
    "        <option value=\"fastest\">{{\"transition.speed.fastest\" | translate}}</option>\n" +
    "      </select>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-3\" ng-if=\"transition.type === 'scroll' || transition.type === 'page'\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label\">{{\"transition.resume.label\" | translate}}</label>\n" +
    "      <span popover=\"{{'transition.resume.tooltip' | translate}}\" popover-trigger=\"click\"\n" +
    "            popover-placement=\"right\" rv-tooltip></span>\n" +
    "      <div class=\"input-group\">\n" +
    "        <input name=\"transition-resume\" type=\"number\" ng-model=\"transition.resume\" class=\"form-control\" />\n" +
    "        <span class=\"input-group-addon\">{{\"common.units.seconds\" | translate}}</span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-3\" ng-if=\"transition.type === 'scroll' || transition.type === 'page'\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label\">{{\"transition.pud.label\" | translate}}</label>\n" +
    "      <span popover=\"{{'transition.pud.tooltip' | translate}}\" popover-trigger=\"click\"\n" +
    "            popover-placement=\"right\" rv-tooltip></span>\n" +
    "      <div class=\"input-group\">\n" +
    "        <input name=\"transition-pud\" type=\"number\" ng-model=\"transition.pud\" class=\"form-control\" />\n" +
    "        <span class=\"input-group-addon\">{{\"common.units.seconds\" | translate}}</span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
