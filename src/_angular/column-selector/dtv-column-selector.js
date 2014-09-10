(function () {
  "use strict";

  angular.module("risevision.widget.common.column-selector", ["risevision.widget.common.column-setting",
          "risevision.widget.common.translate"])
    .directive("columnSelector", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        require: "?ngModel",
        scope: {
          columns: "=",
          columnNames: "="
        },
        template: $templateCache.get("_angular/column-selector/column-selector.html"),
        transclude: false,
        link: function($scope, elm, attrs, ctrl) {
          var watcher = $scope.$watch("columns", function() {
            if ($scope.columns && $scope.columnNames) {
              for (var i = 0; i < $scope.columns.length; i++) {
                for (var j = 0; j < $scope.columnNames.length; j++) {
                  if ($scope.columns[i].id === $scope.columnNames[j].id) {
                    $scope.columns[i].type = $scope.columnNames[j].type;
                    $scope.columns[i].name = $scope.columnNames[j].name;
                    $scope.columnNames[i].show = true;
                  }
                }
              }

              setValidity();

              // Destroy watch
              watcher();
            }
          });

          $scope.show = function(v){return !v.show;};

          $scope.addColumn = function(){
            console.log($scope.selectedColumn);
            $scope.add($scope.selectedColumn);
            $scope.selectedColumn = null;
          };

          $scope.add = function(column) {
            column.show = true;
            $scope.columns.push(column);

            setValidity();
          };

          $scope.remove = function (column) {
            if (column) {
              removeColumn($scope.columns, column.id);

              for (var i = 0; i < $scope.columnNames.length; i++) {
                if (column.id === $scope.columnNames[i].id) {
                  $scope.columnNames[i].show = false;
                  break;
                }
              }

              setValidity();
            }
          };

          function removeColumn(columnsList, id) {
            for(var i = 0; i < columnsList.length; i++) {
              if (columnsList[i].id === id) {
                columnsList.splice(i, 1);
                break;
              }
            }
          }

          function setValidity() {
            if (ctrl) {
              ctrl.$setValidity("required", $scope.columns.length);
            }
          }

        }
      };
    }]);
}());
