(function () {
  "use strict";

  angular.module("risevision.widget.common.widget-button-toolbar", ["risevision.widget.common.translate"])
    .directive("widgetButtonToolbar", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          // TODO: to be determined
        },
        template: $templateCache.get("_angular/widget-button-toolbar/widget-button-toolbar.html"),
        link: function () {
          // TODO: functionality to come
        }
      };
    }]);
}());
