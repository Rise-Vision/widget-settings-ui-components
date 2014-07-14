angular.module("risevision.widget.common.columnSetting", [])
  .directive("columnSetting", ["$log", function ($log) {
    return {
      restrict: "E",
      scope: {
        column: "="
      },
      template: VIEWS["column-setting/column-setting.html"],
      transclude: false,
      link: function($scope, $element) {
        $scope.defaultSetting = {
          alignment: "left",
          width: 0,
          decimals: 0,
          sign: "arrow",
          colorCondition: "none"
        };

        $scope.defaults = function(obj) {
          if (obj) {
            for (var i = 1, length = arguments.length; i < length; i++) {
              var source = arguments[i];
              for (var prop in source) {
                if (obj[prop] === void 0) obj[prop] = source[prop];
              }
            }
          }
          return obj;
        };

        $scope.$watch("column", function(column) {
          $scope.defaults(column, $scope.defaultSetting);
        });
      }
    };
  }]);
