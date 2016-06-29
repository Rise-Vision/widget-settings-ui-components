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
            numeric: false,
            headerText: "",
            width: 100,
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
