var i18n = {
  t: function(value) {
    return value;
  }
};

angular.module("risevision.widget.common", ["risevision.widget.common.translate"], function() {})
  .service("i18nLoader", [function () {
    this.get = function () {
      return { then: function(cb) { cb(); }};
    };
  }]);

angular.module("risevision.widget.common.translate", [])
  // mock the translate filter
  .filter("translate", function () {
    return function (val) {
      return val;
    };
  });
