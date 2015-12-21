(function () {
  "use strict";

  angular.module("risevision.widget.common.order", ["risevision.common.i18n"])
    .directive("order", ["$templateCache", "$log", function ($templateCache/*, $log*/) {
      return {
        restrict: "E",
        scope: {
          order: "="
        },
        template: $templateCache.get("_angular/order/order.html"),
        link: function ($scope) {
          $scope.$watch("order", function(position) {
            if (typeof position === "undefined") {
              // set a default
              $scope.order = "alpha-asc";
            }
          });
        }
      };
    }]);
}());

(function(module) {
try { module = angular.module("risevision.widget.common.order"); }
catch(err) { module = angular.module("risevision.widget.common.order", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/order/order.html",
    "<label>{{\"order.label\" | translate}}</label>\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-6 col-md-3\">\n" +
    "    <select name=\"order\" ng-model=\"order\" class=\"form-control\">\n" +
    "      <option value=\"alpha-asc\">{{\"order.alpha-asc\" | translate}}</option>\n" +
    "      <option value=\"alpha-desc\">{{\"order.alpha-desc\" | translate}}</option>\n" +
    "      <option value=\"date-asc\">{{\"order.date-asc\" | translate}} &uarr;</option>\n" +
    "      <option value=\"date-desc\">{{\"order.date-desc\" | translate}} &darr;</option>\n" +
    "      <option value=\"random\">{{\"order.random\" | translate}}</option>\n" +
    "    </select>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
