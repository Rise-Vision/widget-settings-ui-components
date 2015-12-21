angular.module('risevision.widget.common.fontsizepicker', [])
  .directive('fontSizePicker', ['$log', function ($log) {
    return {
      restrict: 'E',
      scope: false,
      replace: true,
      require: '?ngModel',
      link: function ($scope, elm, attrs, ngModel) {
        var $elm = $(elm);

        //initialize only if not yet initialized
        if (!$elm.data('plugin_fontSizePicker')) {
          $elm.fontSizePicker({
            "font-size": "18"
          });

          var picker = $elm.data('plugin_fontSizePicker');
        }

        if (ngModel) {
          ngModel.$render = function () {
            if(ngModel.$modelValue) {
              picker.setFontSize(ngModel.$modelValue);
            }
          };
        }

        $elm.on("sizeChanged", function(event, size) {
          $scope.$apply(function() {
            ngModel.$setViewValue(size);
          });
        });
      }
    };
  }]);
