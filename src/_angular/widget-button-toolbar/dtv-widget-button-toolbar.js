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
