(function () {
  "use strict";

  angular.module("risevision.widget.common.table-setting", ["risevision.widget.common.translate",
    "risevision.widget.common.color-picker", "risevision.widget.common.font-setting"])
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
              font: {
                family: "Verdana"
              },
              size: "20",
              bold: false,
              italic: false
            },
            dataFont: {
              font: {
                family: "Verdana"
              },
              size: "20",
              bold: false,
              italic: false
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
    "<div class=\"section\">\n" +
    "  <h5>{{'table.heading' | translate}}</h5>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"row-padding\">{{'table.row-padding' | translate}}</label>\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-md-3 col-sm-3 col-xs-6\">\n" +
    "        <div class=\"input-group\">\n" +
    "          <input id=\"row-padding\" type=\"text\"\n" +
    "          ng-model=\"table.rowPadding\" class=\"form-control\" value=\"0\" />\n" +
    "          <span class=\"input-group-addon\">{{'common.units.pixels' | translate}}</span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"col-padding\">{{'table.col-padding' | translate}}</label>\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-md-3 col-sm-3 col-xs-6\">\n" +
    "        <div class=\"input-group\">\n" +
    "          <input id=\"col-padding\" type=\"text\"\n" +
    "          ng-model=\"table.colPadding\" class=\"form-control\" value=\"0\" />\n" +
    "          <span class=\"input-group-addon\">{{'common.units.pixels' | translate}}</span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"row-color\">{{'table.row-color' | translate}}</label>\n" +
    "    <div>\n" +
    "      <input color-picker id=\"row-color\" color=\"table.rowColor\" type=\"background\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"alt-row-color\">{{'table.alt-row-color' | translate}}</label>\n" +
    "    <div>\n" +
    "      <input color-picker id=\"alt-row-color\" color=\"table.altRowColor\" type=\"background\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"col-header-font\">{{'table.col-header-font.heading' | translate}}</label>\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-md-12\">\n" +
    "        <font-setting font-data=\"table.colHeaderFont\"\n" +
    "            preview-text=\"{{'table.col-header-font.text' | translate}}\">\n" +
    "        </font-setting>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"data-font\">{{'table.data-font.heading' | translate}}</label>\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-md-12\">\n" +
    "        <font-setting font-data=\"table.dataFont\"\n" +
    "            preview-text=\"{{'table.data-font.text' | translate}}\">\n" +
    "        </font-setting>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
