(function () {
  "use strict";

  angular.module("risevision.widget.common.widget-button-toolbar", ["risevision.widget.common.translate"])
    .directive("widgetButtonToolbar", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          help: "@",
          contribute: "@",
          save: "&",
          cancel: "&",
          disableSave: "&"
        },
        template: $templateCache.get("_angular/widget-button-toolbar/widget-button-toolbar.html"),
        link: function ($scope, elem, attrs) {
          $scope.helpRef = "";
          $scope.contributeRef = "";

          if (typeof attrs.help !== "undefined" && attrs.help !== "") {
            $scope.helpRef = attrs.help;
          }

          if (typeof attrs.contribute !== "undefined" && attrs.contribute !== "") {
            $scope.contributeRef = attrs.contribute;
          }

        }
      };
    }]);
}());

(function(module) {
try { app = angular.module("risevision.widget.common.widget-button-toolbar"); }
catch(err) { app = angular.module("risevision.widget.common.widget-button-toolbar", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/widget-button-toolbar/widget-button-toolbar.html",
    "<div class=\"btn-toolbar sticky-buttons\">\n" +
    "  <button id=\"save\" class=\"btn btn-success btn-fixed-width\" type=\"button\" ng-click=\"save()\" ng-disabled=\"disableSave()\">\n" +
    "    <span>{{\"common.buttons.save\" | translate}}</span>\n" +
    "    <i class=\"fa fa-white fa-check fa-lg icon-right\"></i>\n" +
    "  </button>\n" +
    "  <button id=\"cancel\" class=\"btn btn-primary btn-fixed-width\" type=\"button\" ng-click=\"cancel()\">\n" +
    "    <span>{{\"common.buttons.cancel\" | translate}}</span>\n" +
    "    <i class=\"fa fa-white fa-times fa-lg icon-right\"></i>\n" +
    "  </button>\n" +
    "  <a type=\"button\" class=\"btn btn-rv-help btn-fixed-width\" target=\"_blank\" href={{helpRef}} ng-if=\"helpRef !== ''\">\n" +
    "    <span>{{\"common.buttons.help\" | translate}}</span>\n" +
    "    <i class=\"fa fa-question-circle fa-lg icon-right\"></i>\n" +
    "  </a>\n" +
    "  <a type=\"button\" class=\"btn btn-rv-help btn-fixed-width\" target=\"_blank\" href={{contributeRef}} ng-if=\"contributeRef !== ''\">\n" +
    "    <span>{{\"common.buttons.contribute\" | translate}}</span>\n" +
    "    <i class=\"fa fa-github fa-lg icon-right\"></i>\n" +
    "  </a>\n" +
    "</div>\n" +
    "");
}]);
})();
