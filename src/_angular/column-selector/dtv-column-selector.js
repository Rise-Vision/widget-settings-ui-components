/* global VIEWS */
(function () {
  "use strict";

  angular.module("risevision.widget.common.column-selector", [])
    .directive("columnSelector", function () {
      return {
        restrict: "E",
        scope: {
          columns: "=",
          columnNames: "="
        },
        template: VIEWS["column-selector/column-selector.html"],
        transclude: false,
        link: function($scope) {

          var watcher = $scope.$watch("columns", function() {
            if ($scope.columns && $scope.columnNames) {
              for (var i = 0; i < $scope.columns.length; i++) {
                for (var j = 0; j < $scope.columnNames.length; j++) {
                  if ($scope.columns[i].name === $scope.columnNames[j].name) {
                    $scope.columnNames[j].show = true;
                  }
                }
              }

              // Destroy watch
              watcher();
            }
          });

          $scope.onColumnClick = function(column) {
            if (column.show) {
              var newColumn = {
                name: column.name,
                type: column.type
              };
              $scope.columns.push(newColumn);
            }
            else {
              for(var i = 0; i < $scope.columns.length; i++) {
                if ($scope.columns[i].name === column.name) {
                  $scope.columns.splice(i, 1);
                }
              }
            }
          };

        }
      };
    });
}());
