angular.module('risevision.widget.common')
  .directive('fontPicker', ['i18nLoader', '$log', function (i18nLoader, $log) {
    return {
      restrict: 'A',
      scope: {
        prefix: '=',
        i18nPrefix: '=',
        fontData: '=',
        fontVisible: '=',
        fontSizeVisible: '=',
        textVisible: '='
      },
      template: VIEWS['font-picker/font-picker.html'],
      transclude: false,
      link: function ($scope, elm, attrs) {
        var stripLast = function (str, strToStrip) {
          var index = str.indexOf(strToStrip);
          if(index >= 0) {
            str = str.substring(0, str.lastIndexOf(strToStrip));
          }
          return str;
        };

        var valOrDefault = function (val, defaultVal) {
          if (angular.isUndefined(val) || val === null) {
            return defaultVal;
          }
          else {
            return val;
          }
        };
        var $elm = $(elm);
        var prefix = $scope.prefix || stripLast(attrs.id, '-font');
        var picker = $elm.data('font-picker');

        $scope.$watch('fontData', function(fontData) {
          if (fontData) {
            $elm.fontPicker({
              'i18n-prefix': $scope.i18nPrefix || attrs.id,
              'defaults' : {
                'font' : $scope.fontData.font,
                'font-url' : $scope.fontData.fontUrl,
                'font-size' : $scope.fontData.fontSize,
                'is-bold' : $scope.fontData.isBold,
                'is-italic' : $scope.fontData.isItalic,
                'color' : $scope.fontData.color
              },
              'visibility': {
                'font' : valOrDefault($scope.fontVisible, true),
                'font-size' : valOrDefault($scope.fontSizeVisible, true),
                'variants' : valOrDefault($scope.fontSizeVisible, true),
                'text' : valOrDefault($scope.textVisible, true)
              }
            });

            //load i18n text translations after ensuring i18n has been initialized
            i18nLoader.get().then(function () {$elm.i18n();});
          }
        });

        $scope.$parent.$on('collectAdditionalParams', function () {
          $log.debug('Collecting params from', prefix, picker);
          $scope.fontData.font = picker.getFont();
          //$scope.fontData.fontStyle = picker.getFontStyle();
          $scope.fontData.fontUrl = picker.getfontURL();
          $scope.fontData.fontSize = picker.getFontSize();
          $scope.fontData.isBold = picker.getBold();
          $scope.fontData.isItalic = picker.getItalic();
          $scope.fontData.color = picker.getColor();
        });
      }
    };
  }]);
