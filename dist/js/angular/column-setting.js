(function () {
  "use strict";

  angular.module("risevision.widget.common.column-setting", ["risevision.widget.common.translate"])
    .directive("columnSetting", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          column: "=",
          expand: "="
        },
        template: $templateCache.get("_angular/column-setting/column-setting.html"),
        transclude: false,
        link: function($scope) {

          var defaultNumberSettings = {
            type: "int",
            width: "100",
            decimals: 0,
            sign: "arrow",
            colorCondition: "none"
          };
          var defaultStringSettings = {
            type: "string",
            width: "100"
          };
          var defaultDateSettings = {
            type: "date",
            width: "100",
            date: "medium"
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

          $scope.$watch("column", function(column) {
            var defaultSetting;

            if (typeof column.type !== "undefined") {
              switch (column.type) {
                case "int":
                case "number":
                  defaultSetting = defaultNumberSettings;
                  break;
                case "string":
                case "text":
                  defaultSetting = defaultStringSettings;
                  break;
                case "date":
                  defaultSetting = defaultDateSettings;
                  break;
                default:
                  defaultSetting = defaultStringSettings;
              }

              $scope.defaults(column, defaultSetting);
            }
            else {
              $scope.defaults(column, defaultStringSettings);
            }
          });

          $scope.remove = function() {
            $scope.$parent.remove($scope.column);
          };
        }
      };
    }]);
}());

(function(module) {
try { app = angular.module("risevision.widget.common.column-setting"); }
catch(err) { app = angular.module("risevision.widget.common.column-setting", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/column-setting/column-setting.html",
    "<div class=\"panel panel-default\">\n" +
    "  <div class=\"collapse-panel panel-heading\">\n" +
    "    <a href=\"\" ondragstart=\"return false;\"\n" +
    "    ng-class=\"{'panel-heading':true, collapsed:!collapse}\" ng-click=\"collapse=!collapse\">\n" +
    "       {{column.name | translate}}\n" +
    "    </a>\n" +
    "    <a href=\"\" ondragstart=\"return false;\" class=\"fa fa-minus-circle fa-lg remove-column-button\" ng-click=\"remove()\"></a>\n" +
    "  </div>\n" +
    "  <div ng-class=\"{'panel-collapse':true, collapse:true, in:collapse}\">\n" +
    "    <div class=\"panel-body\">\n" +
    "     <!-- header -->\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"column-header-text\">\n" +
    "              {{'column.header-text.label' | translate}}\n" +
    "            </label>\n" +
    "            <input id=\"column-header-text\" type=\"text\" ng-model=\"column.headerText\" class=\"form-control\" />\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <!-- width -->\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"column-width\">\n" +
    "              {{'column.width' | translate}}\n" +
    "            </label>\n" +
    "            <div class=\"input-group\">\n" +
    "              <input id=\"column-width\" type=\"text\" ng-model=\"column.width\" class=\"form-control\" />\n" +
    "              <span class=\"input-group-addon\">{{'common.units.pixels' | translate}}</span>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <!-- decimal -->\n" +
    "      <div class=\"row\" ng-if=\"column.type === 'int' || column.type === 'number'\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"column-decimals\">\n" +
    "              {{'column.decimals.label' | translate}}\n" +
    "            </label>\n" +
    "            <select id=\"column-decimals\" ng-model=\"column.decimals\" class=\"form-control\">\n" +
    "              <option value=\"0\">0</option>\n" +
    "              <option value=\"1\">1</option>\n" +
    "              <option value=\"2\">2</option>\n" +
    "              <option value=\"3\">3</option>\n" +
    "              <option value=\"4\">4</option>\n" +
    "            </select>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <!-- sign -->\n" +
    "      <div class=\"row\" ng-if=\"column.type === 'int' || column.type === 'number'\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"column-sign\">\n" +
    "              {{'column.sign.label' | translate}}\n" +
    "            </label>\n" +
    "            <select id=\"column-sign\" ng-model=\"column.sign\" class=\"form-control\">\n" +
    "              <option value=\"neg\">-</option>\n" +
    "              <option value=\"pos-neg\">+/-</option>\n" +
    "              <option value=\"bracket\">()</option>\n" +
    "              <option value=\"arrow\">Arrow</option>\n" +
    "            </select>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <!-- color-condition -->\n" +
    "      <div class=\"row\" ng-if=\"column.type === 'int' || column.type === 'number'\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"column-color-condition\">\n" +
    "              {{'column.color-condition.label' | translate}}\n" +
    "            </label>\n" +
    "            <select id=\"column-color-condition\" ng-model=\"column.colorCondition\" class=\"form-control\">\n" +
    "              <option value=\"none\">{{'column.color-condition.none' | translate}}</option>\n" +
    "              <option value=\"up-green\">{{'column.color-condition.up-green' | translate}}</option>\n" +
    "              <option value=\"up-red\">{{'column.color-condition.up-red' | translate}}</option>\n" +
    "              <option value=\"positive-green\">{{'column.color-condition.positive-green' | translate}}</option>\n" +
    "              <option value=\"positive-red\">{{'column.color-condition.positive-red' | translate}}</option>\n" +
    "            </select>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <!-- date -->\n" +
    "      <div class=\"row\" ng-if=\"column.type === 'date' || column.type === 'datetime'\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"column-date\">\n" +
    "              {{'column.date.label' | translate}}\n" +
    "            </label>\n" +
    "            <select id=\"column-date\" ng-model=\"column.date\" class=\"form-control\">\n" +
    "              <option value=\"short\">{{'column.date.short' | translate}}</option>\n" +
    "              <option value=\"medium\">{{'column.date.medium' | translate}}</option>\n" +
    "              <option value=\"long\">{{'column.date.long' | translate}}</option>\n" +
    "            </select>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <!-- END options -->\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
