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
          $scope.defaultSetting = {
            type: "int",
            alignment: "left",
            width: "100px",
            decimals: 0,
            sign: "arrow",
            colorCondition: "none"
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
            $scope.defaults(column, $scope.defaultSetting);
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
    "    <a href=\"\" ng-class=\"{'panel-title':true, collapsed:!collapse}\" ng-click=\"collapse=!collapse\">\n" +
    "       {{'columns.' + column.name | translate}}\n" +
    "    </a>\n" +
    "    <a href=\"\" class=\"glyphicon glyphicon-trash\" ng-click=\"remove()\"></a>\n" +
    "  </div>\n" +
    "  <div ng-class=\"{'panel-collapse':true, collapse:true, in:collapse}\">\n" +
    "    <div class=\"panel-body\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"column-alignment\">\n" +
    "              {{'column.alignment.label' | translate}}\n" +
    "            </label>\n" +
    "            <alignment align=\"column.alignment\"></alignment>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"column-width\">\n" +
    "              {{'column.width.label' | translate}}\n" +
    "            </label>\n" +
    "            <tooltip data-toggle=\"popover\" data-placement=\"right\"\n" +
    "              data-content=\"{{'column.width.tooltip' | translate}}\">\n" +
    "            </tooltip>\n" +
    "            <input id=\"column-width\" type=\"text\" ng-model=\"column.width\" class=\"form-control\" />\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row\" ng-if=\"column.type === 'int'\">\n" +
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
    "      <div class=\"row\" ng-if=\"column.type === 'int'\">\n" +
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
    "      <div class=\"row\" ng-if=\"column.type === 'int'\">\n" +
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
    "      <div class=\"row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"column-header-text\">\n" +
    "              {{'column.header-text.label' | translate}}\n" +
    "            </label>\n" +
    "            <tooltip data-toggle=\"popover\" data-placement=\"right\"\n" +
    "              data-content=\"{{'column.header-text.tooltip' | translate}}\">\n" +
    "            </tooltip>\n" +
    "            <input id=\"column-header-text\" type=\"text\" ng-model=\"column.headerText\" class=\"form-control\" />\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
