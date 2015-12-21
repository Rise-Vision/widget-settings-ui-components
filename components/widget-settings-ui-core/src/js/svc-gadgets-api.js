angular.module("risevision.widget.common")
  .factory("gadgetsApi", ["$window", function ($window) {
    return $window.gadgets;
  }]);
