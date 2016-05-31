(function () {
  "use strict";

  angular.module("risevision.widget.common.column-setting", ["risevision.common.i18n", "risevision.widget.common.font-setting"])
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
          var defaultSettings = {
            fontStyle: {
              font: {
                "family":"verdana,geneva,sans-serif",
                "type":"standard",
                "url":""
              },
              size: "18px",
              customSize: "",
              align: "left",
              bold: false,
              italic: false,
              underline: false,
              forecolor: "black",
              backcolor: "transparent"
            },
            width: 100,
            decimals: 0,
            sign: "none",
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

          $scope.$watch("column.numeric", function(value) {
            if (typeof value !== "undefined" && value !== "") {
              if (value) {
                defaultSettings.type = "int";
              }
              else {
                defaultSettings.type = "string";
              }
            }
            else {
              defaultSettings.type = "string";
            }

            $scope.defaults($scope.column, defaultSettings);
          });

          $scope.remove = function() {
            $scope.$parent.remove($scope.column);
          };
        }
      };
    }]);
}());

(function(module) {
try { module = angular.module("risevision.widget.common.column-setting"); }
catch(err) { module = angular.module("risevision.widget.common.column-setting", []); }
module.run(["$templateCache", function($templateCache) {
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
    "\n" +
    "      <!-- Numeric data column -->\n" +
    "      <div class=\"checkbox\">\n" +
    "        <label>\n" +
    "          <input type=\"checkbox\" ng-model=\"column.numeric\">{{'column.numeric' | translate}}\n" +
    "        </label>\n" +
    "        <span class=\"text-danger\" style=\"float:right\">\n" +
    "          {{'column.note' | translate}}\n" +
    "        </span>\n" +
    "      </div>\n" +
    "\n" +
    "      <font-setting font-data=\"column.fontStyle\">\n" +
    "      </font-setting>\n" +
    "\n" +
    "      <div class=\"row\">\n" +
    "\n" +
    "        <!-- Header Text -->\n" +
    "        <div class=\"col-sm-6 col-xs-12\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"column-header-text\">\n" +
    "              {{'column.header-text.label' | translate}}\n" +
    "            </label>\n" +
    "            <input type=\"text\" ng-model=\"column.headerText\" class=\"form-control\">\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Width -->\n" +
    "        <div class=\"col-sm-6 col-xs-12\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"column-width\">\n" +
    "              {{'column.width' | translate}}\n" +
    "            </label>\n" +
    "            <div class=\"input-group\">\n" +
    "              <input type=\"number\" ng-model=\"column.width\" class=\"form-control\">\n" +
    "              <span class=\"input-group-addon\">{{'common.units.pixels' | translate}}</span>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"row\">\n" +
    "\n" +
    "        <!-- Decimals -->\n" +
    "        <div class=\"col-sm-4 col-xs-12\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"column-decimals\">\n" +
    "              {{'column.decimals.label' | translate}}\n" +
    "            </label>\n" +
    "            <select class=\"form-control\" ng-model=\"column.decimals\"\n" +
    "              ng-disabled=\"!column.numeric\">\n" +
    "              <option value=\"0\">0</option>\n" +
    "              <option value=\"1\">1</option>\n" +
    "              <option value=\"2\">2</option>\n" +
    "              <option value=\"3\">3</option>\n" +
    "              <option value=\"4\">4</option>\n" +
    "            </select>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Sign -->\n" +
    "        <div class=\"col-sm-4 col-xs-12\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"column-sign\">\n" +
    "              {{'column.sign.label' | translate}}\n" +
    "            </label>\n" +
    "            <select class=\"form-control\" ng-model=\"column.sign\"\n" +
    "              ng-disabled=\"!column.numeric\">\n" +
    "              <option value=\"none\">{{'column.sign.none' | translate}}</option>\n" +
    "              <option value=\"neg\">-</option>\n" +
    "              <option value=\"pos-neg\">+/-</option>\n" +
    "              <option value=\"bracket\">()</option>\n" +
    "              <option value=\"arrow\">{{'column.sign.arrow' | translate}}</option>\n" +
    "            </select>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Color Conditions -->\n" +
    "        <div class=\"col-sm-4 col-xs-12\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"column-color-condition\">\n" +
    "                {{'column.color-condition.label' | translate}}\n" +
    "              </label>\n" +
    "            <select class=\"form-control\" ng-model=\"column.colorCondition\"\n" +
    "              ng-disabled=\"!column.numeric\">\n" +
    "              <option value=\"none\">{{'column.color-condition.none' | translate}}</option>\n" +
    "              <option value=\"change-up\">{{'column.color-condition.change-up' | translate}}</option>\n" +
    "              <option value=\"change-down\">{{'column.color-condition.change-down' | translate}}</option>\n" +
    "              <option value=\"value-positive\">{{'column.color-condition.value-positive' | translate}}</option>\n" +
    "              <option value=\"value-negative\">{{'column.color-condition.value-negative' | translate}}</option>\n" +
    "            </select>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();
