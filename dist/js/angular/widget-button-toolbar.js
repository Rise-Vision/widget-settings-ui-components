(function () {
  "use strict";

  angular.module("risevision.widget.common.widget-button-toolbar", ["risevision.common.i18n"])
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
try { module = angular.module("risevision.widget.common.widget-button-toolbar"); }
catch(err) { module = angular.module("risevision.widget.common.widget-button-toolbar", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/widget-button-toolbar/widget-button-toolbar.html",
    "<div class=\"btn-toolbar sticky-buttons\">\n" +
    "  <button id=\"save\" class=\"btn btn-primary btn-fixed-width\" type=\"button\" ng-click=\"save()\" ng-disabled=\"disableSave()\">\n" +
    "    <span>{{\"common.save\" | translate}}</span>\n" +
    "    <i class=\"fa fa-white fa-check fa-lg icon-right\"></i>\n" +
    "  </button>\n" +
    "  <button id=\"cancel\" class=\"btn btn-default btn-fixed-width\" type=\"button\" ng-click=\"cancel()\">\n" +
    "    <span>{{\"common.cancel\" | translate}}</span>\n" +
    "    <i class=\"fa fa-white fa-times fa-lg icon-right\"></i>\n" +
    "  </button>\n" +
    "  <a type=\"button\" class=\"btn btn-rv-help btn-fixed-width\" target=\"_blank\" href={{helpRef}} ng-if=\"helpRef !== ''\">\n" +
    "    <span>{{\"common.help\" | translate}}</span>\n" +
    "    <i class=\"fa fa-question-circle fa-lg icon-right\"></i>\n" +
    "  </a>\n" +
    "  <a type=\"button\" class=\"btn btn-rv-help btn-fixed-width\" target=\"_blank\" href={{contributeRef}} ng-if=\"contributeRef !== ''\">\n" +
    "    <span>{{\"common.contribute\" | translate}}</span>\n" +
    "    <i class=\"fa fa-github fa-lg icon-right\"></i>\n" +
    "  </a>\n" +
    "</div>\n" +
    "");
}]);
})();
