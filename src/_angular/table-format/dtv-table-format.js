angular.module("risevision.widget.common")
  .directive("tableFormat", ["$log", function ($log) {
    return {
      restrict: "E",
      scope: {
        table: "="
      },
      template: VIEWS["table-format/table-format.html"],
      transclude: false,
      link: function($scope, $element) {
        $scope.defaultSetting = {
          colHeaderFont: {
            font: 'Verdana',
            fontSize: '20',
            isBold: 'false',
            isItalic: 'false'
          },
          dataFont: {
            font: 'Verdana',
            fontSize: '20',
            isBold: 'false',
            isItalic: 'false'
          },
          rowColor: 'transparent',
          altRowColor: 'transparent',
          rowPadding:'0',
          colPadding:'0'
        };

        $scope.defaults = function(obj) {
          if (obj) {
            for (var i = 1, length = arguments.length; i < length; i++) {
              var source = arguments[i];
              for (var prop in source) {
                if (obj[prop] === void 0) obj[prop] = source[prop];
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
