angular.module('risevision.widget.common', [], function() {

})
// mock the translate filter
.filter('translate', function () {
  return function (val) {
    return val;
  };
});
