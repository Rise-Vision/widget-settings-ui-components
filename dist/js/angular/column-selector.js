(function () {
  "use strict";

  angular.module("risevision.widget.common.column-selector", [])
    .directive("columnSelector", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          columns: "=",
          columnNames: "="
        },
        template: $templateCache.get("column-selector/column-selector.html"),
        transclude: false,
        link: function($scope) {

          var watcher = $scope.$watch("columns", function() {
            if ($scope.columns && $scope.columnNames) {
              for (var i = 0; i < $scope.columns.length; i++) {
                for (var j = 0; j < $scope.columnNames.length; j++) {
                  if ($scope.columns[i].name === $scope.columnNames[j].name) {
                    $scope.columnNames[j].show = true;
                    $scope.columns[i].type = $scope.columnNames[j].type;
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
    "		    <label for=\"columns-to-display\">{{'columns.label' | translate}}</label>\n" +
    "		    <button type=\"button\"\n" +
    "				class=\"btn btn-link btn-help\"\n" +
    "				data-toggle=\"popover\" data-placement=\"right\">\n" +
    "				<span class=\"glyphicons circle_question_mark\"></span>\n" +
    "			</button>\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"col-md-3\" ng-repeat=\"column in columnNames\">\n" +
    "					<div class=\"checkbox\">\n" +
    "						<label for=\"columns-{{column.name}}\">\n" +
    "							<input id=\"columns-{{column.name}}\" name=\"columns-{{column.name}}\" type=\"checkbox\"\n" +
    "							ng-change=\"onColumnClick(column)\" ng-model=\"column.show\" />\n" +
    "							{{'columns.' + column.name | translate}}\n" +
    "						</label>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<div class=\"row\" ng-repeat=\"column in columns\">\n" +
    "	<div class=\"col-md-12\">\n" +
    "		<column-setting column=\"column\"></column-setting>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);
})();
