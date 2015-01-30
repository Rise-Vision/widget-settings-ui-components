(function () {
  "use strict";

  angular.module("risevision.widget.common.position-setting", ["risevision.common.i18n"])
    .directive("positionSetting", ["$templateCache", "$log", function ($templateCache/*, $log*/) {
      return {
        restrict: "E",
        scope: {
          position: "=",
          hideLabel: "@"
        },
        template: $templateCache.get("_angular/position-setting/position-setting.html"),
        link: function ($scope) {
          $scope.$watch("position", function(position) {
            if (typeof position === "undefined") {
              // set a default
              $scope.position = "top-left";
            }
          });
        }
      };
    }]);
}());

(function(module) {
try { app = angular.module("risevision.widget.common.position-setting"); }
catch(err) { app = angular.module("risevision.widget.common.position-setting", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/position-setting/position-setting.html",
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <label ng-if=\"!hideLabel\"> {{'widgets.alignment' | translate}}</label>\n" +
    "    <select name=\"position\" ng-model=\"position\" class=\"form-control\">\n" +
    "      <option value=\"top-left\">{{'position.top.left' | translate}}</option>\n" +
    "      <option value=\"top-center\">{{'position.top.center' | translate}}</option>\n" +
    "      <option value=\"top-right\">{{'position.top.right' | translate}}</option>\n" +
    "      <option value=\"middle-left\">{{'position.middle.left' | translate}}</option>\n" +
    "      <option value=\"middle-center\">{{'position.middle.center' | translate}}</option>\n" +
    "      <option value=\"middle-right\">{{'position.middle.right' | translate}}</option>\n" +
    "      <option value=\"bottom-left\">{{'position.bottom.left' | translate}}</option>\n" +
    "      <option value=\"bottom-center\">{{'position.bottom.center' | translate}}</option>\n" +
    "      <option value=\"bottom-right\">{{'position.bottom.right' | translate}}</option>\n" +
    "    </select>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
