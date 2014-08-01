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

          $scope.onColumnClick = function(column) {
            column.show = !column.show;
            if (column.show !== true) {
              var newColumn = {
                name: column.name,
                type: column.type
              };
              $scope.columns.push(newColumn);
            }
            else {
              removeColumn($scope.columns, column.name);
            }
          };

          function removeColumn(columnsList, name) {
            for(var i = 0; i < columnsList.length; i++) {
              if (columnsList[i].name === name) {
                columnsList.splice(i, 1);
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
    "		    <label for=\"columns-to-display\">{{'columns.label' | translate}}</label>\n" +
    "		    <button type=\"button\"\n" +
    "				class=\"btn btn-link btn-help\"\n" +
    "				data-toggle=\"popover\" data-placement=\"right\">\n" +
    "				<span class=\"glyphicons circle_question_mark\"></span>\n" +
    "			</button>\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"col-md-8\">\n" +
    "					<div class=\"tag-manager tags\">\n" +
    "						<span ng-repeat=\"column in columnNames\"\n" +
    "						ng-class=\"{label:true, 'label-primary':!column.show, 'label-default':column.show}\"\n" +
    "						ng-click=\"onColumnClick(column)\">\n" +
    "							{{'columns.' + column.name | translate}}\n" +
    "						</span>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<div class=\"row\" ng-repeat=\"column in columns\">\n" +
    "	<div class=\"col-md-12\">\n" +
    "		<div class=\"panel-group\">\n" +
    "			<column-setting column=\"column\"></column-setting>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);
})();
