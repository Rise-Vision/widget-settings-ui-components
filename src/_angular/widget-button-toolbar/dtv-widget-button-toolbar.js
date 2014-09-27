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
          disablesave: "&"
        },
        template: $templateCache.get("_angular/widget-button-toolbar/widget-button-toolbar.html"),
        link: function ($scope, elem, attrs) {
          var defaultHelpRef = "http://www.risevision.com/help/users/",
            defaultContributeRef = "https://github.com/Rise-Vision/";

          $scope.helpRef = attrs.help || defaultHelpRef;
          $scope.contributeRef = attrs.contribute || defaultContributeRef;
        }
      };
    }]);
}());
