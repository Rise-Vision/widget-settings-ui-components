(function () {
  "use strict";

  angular.module("risevision.widget.common.column-selector", ["risevision.widget.common.column-setting",
          "risevision.common.i18n"])
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
          var columnsWatcher = $scope.$watch("columns", function() {
            if ($scope.columns && $scope.columnNames) {
              updateColumns();
              setValidity();

              // Destroy watch
              columnsWatcher();
            }
          });

          var columnNamesWatcher = $scope.$watch("columnNames", function(columnNames) {
            if ($scope.columns && columnNames && columnNames.length > 0) {
              updateColumns();

              // Destroy watch
              columnNamesWatcher();
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

          function updateColumns() {
            for (var i = 0; i < $scope.columns.length; i++) {
              for (var j = 0; j < $scope.columnNames.length; j++) {
                if ($scope.columns[i].id === $scope.columnNames[j].id) {
                  $scope.columns[i].type = $scope.columnNames[j].type;
                  $scope.columns[i].name = $scope.columnNames[j].name;
                  $scope.columnNames[j].show = true;
                }
              }
            }
          }
        }
      };
    }]);
}());

(function(module) {
try { module = angular.module("risevision.widget.common.column-selector"); }
catch(err) { module = angular.module("risevision.widget.common.column-selector", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/column-selector/column-selector.html",
    "<div class=\"section\">\n" +
    "	<div class=\"row\">\n" +
    "		<div class=\"col-md-12\">\n" +
    "			<div class=\"form-group\">\n" +
    "				<label for=\"columns\" class=\"control-label\">{{'column.select-title' | translate}}</label>\n" +
    "		    <select id=\"column-selector\" class=\"form-control\" ng-model=\"selectedColumn\"\n" +
    "				ng-options=\"column.name | translate for column in columnNames | filter:show track by column.id\"\n" +
    "				ng-change=\"addColumn()\"></select>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"row\">\n" +
    "		<div class=\"col-md-12\">\n" +
    "			<div class=\"panel-group\">\n" +
    "				<column-setting column=\"column\" ng-repeat=\"column in columns\"></column-setting>\n" +
    "			</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);
})();
