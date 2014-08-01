(function () {
  "use strict";

  angular.module("risevision.widget.common.table-setting", ["risevision.widget.common.translate"])
    .directive("tableSetting", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          table: "="
        },
        template: $templateCache.get("_angular/table-setting/table-setting.html"),
        transclude: false,
        link: function($scope) {
          $scope.defaultSetting = {
            colHeaderFont: {
              font: "Verdana",
              fontSize: "20",
              isBold: "false",
              isItalic: "false"
            },
            dataFont: {
              font: "Verdana",
              fontSize: "20",
              isBold: "false",
              isItalic: "false"
            },
            rowColor: "transparent",
            altRowColor: "transparent",
            rowPadding:"0",
            colPadding:"0"
          };

          $scope.defaults = function(obj) {
            if (obj) {
              for (var i = 1, length = arguments.length; i < length; i++) {
                var source = arguments[i];

                for (var prop in source) {
                  if (obj[prop] === void 0) {
                    obj[prop] = source[prop];
                  }
                }
              }
            }
            return obj;
          };

          $scope.$watch("table", function(table) {
            $scope.defaults(table, $scope.defaultSetting);
          });
        }
      };
    }]);
}());

(function(module) {
try { app = angular.module("risevision.widget.common.table-setting"); }
catch(err) { app = angular.module("risevision.widget.common.table-setting", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/table-setting/table-setting.html",
    "<div class=\"row\">\n" +
    "	<div class=\"col-md-3\">\n" +
    "		<div class=\"form-group\">\n" +
    "	    <label for=\"row-padding\">{{'table.row-padding' | translate}}</label>\n" +
    "	    <input id=\"row-padding\" type=\"text\"\n" +
    "			ng-model=\"table.rowPadding\" class=\"form-control\" value=\"0\" />\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "	<div class=\"col-md-3\">\n" +
    "		<div class=\"form-group\">\n" +
    "			<label for=\"col-padding\">{{'table.col-padding' | translate}}</label>\n" +
    "	    <input id=\"col-padding\" type=\"text\"\n" +
    "			ng-model=\"table.colPadding\" class=\"form-control\" value=\"0\" />\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<div id=\"col-header-font\" class=\"current\"\n" +
    "    font-setting\n" +
    "		font-data=\"table.colHeaderFont\"\n" +
    "		i18n-prefix=\"'table.col-header-font'\"\n" +
    "		prefix=\"'col-header'\">\n" +
    "</div>\n" +
    "<div id=\"data-font\" class=\"current\"\n" +
    "    font-setting\n" +
    "		font-data=\"table.dataFont\"\n" +
    "    i18n-prefix=\"table.data-font\"\n" +
    "  	prefix=\"data\">\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "	<div class=\"col-md-3\">\n" +
    "		<div class=\"form-group\">\n" +
    "	    <label for=\"row-color\">{{'table.row-color' | translate}}</label>\n" +
    "			<input color-picker id=\"row-color\" color=\"table.rowColor\"\n" +
    "				type=\"text\" />\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "	<div class=\"col-md-3\">\n" +
    "		<div class=\"form-group\">\n" +
    "	    <label for=\"alt-row-color\">{{'table.alt-row-color' | translate}}</label>\n" +
    "			<input color-picker id=\"alt-row-color\" color=\"table.altRowColor\"\n" +
    "				type=\"text\" />\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);
})();
