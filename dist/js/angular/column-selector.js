(function () {
  "use strict";

  angular.module("risevision.widget.common.column-selector", ["risevision.widget.common.column-setting",
          "risevision.widget.common.translate"])
    .directive("columnSelector", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          columns: "=",
          columnNames: "="
        },
        template: $templateCache.get("_angular/column-selector/column-selector.html"),
        transclude: false,
        link: function($scope) {

          var watcher = $scope.$watch("columns", function() {
            if ($scope.columns && $scope.columnNames) {
              for (var i = 0; i < $scope.columns.length; i++) {
                for (var j = 0; j < $scope.columnNames.length; j++) {
                  if ($scope.columns[i].name === $scope.columnNames[j].name) {
                    $scope.columns[i].type = $scope.columnNames[j].type;
                    $scope.columnNames[i].show = true;
                  }
                }
              }

              // Destroy watch
              watcher();
            }
          });

          $scope.add = function(column) {
            column.show = true;
            $scope.columns.push(column);
          };

          $scope.remove = function (column) {
            if (column) {
              removeColumn($scope.columns, column.name);

              for (var i = 0; i < $scope.columnNames.length; i++) {
                if (column.name === $scope.columnNames[i].name) {
                  $scope.columnNames[i].show = false;
                  break;
                }
              }
            }
          };

          function removeColumn(columnsList, name) {
            for(var i = 0; i < columnsList.length; i++) {
              if (columnsList[i].name === name) {
                columnsList.splice(i, 1);
                break;
              }
            }
          }

        }
      };
    }]);
}());

(function(module) {
try { app = angular.module("risevision.widget.common.column-selector"); }
catch(err) { app = angular.module("risevision.widget.common.column-selector", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/column-selector/column-selector.html",
    "<div class=\"row\">\n" +
    "	<div class=\"col-md-12\">\n" +
    "		<div class=\"form-group\">\n" +
    "		  <label for=\"columns-to-display\">{{'columns.label' | translate}}</label>\n" +
    "			<tooltip data-toggle=\"popover\" data-placement=\"right\"\n" +
    "				data-content=\"{{'columns.tooltip' | translate}}\">\n" +
    "			</tooltip>\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"col-md-8\">\n" +
    "					<div class=\"tag-manager tags\">\n" +
    "						<span ng-repeat=\"column in columnNames\" ng-hide=\"column.show\" class=\"label label-primary\"\n" +
    "						ng-click=\"add(column)\">\n" +
    "							{{'columns.' + column.name | translate}}\n" +
    "							<span class=\"glyphicon glyphicon-plus\"></span>\n" +
    "						</span>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "	<div class=\"col-md-12\">\n" +
    "		<div class=\"panel-group\">\n" +
    "			<column-setting column=\"column\" ng-repeat=\"column in columns\"></column-setting>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);
})();
