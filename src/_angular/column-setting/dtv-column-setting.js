angular.module('risevision.widget.common')
  .directive('columnSetting', ['i18nLoader', '$log', function (i18nLoader, $log) {
    return {
      restrict: 'E',
      scope: {
        column: '='
      },
      template: VIEWS['column-setting/column-setting.html'],
      transclude: false,
      link: function($scope, $element) {
        var defaultSetting = {
          alignment: 'left',
          width: 0,
          decimals: 0,
          sign: 'arrow',
          colorCondition: 'none'
        };

        $scope.defaults = function(obj) {
          for (var i = 1, length = arguments.length; i < length; i++) {
            var source = arguments[i];
            for (var prop in source) {
              if (obj[prop] === void 0) obj[prop] = source[prop];
            }
          }
          return obj;
        };

        $scope.defaults($scope.column, defaultSetting);
      }
    };
  }]);
