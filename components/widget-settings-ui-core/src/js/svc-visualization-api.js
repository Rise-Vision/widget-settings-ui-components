(function (angular) {
  "use strict";

  angular.module("risevision.widget.common.visualization", [])
    .factory("visualizationApi", ["$q", "$window", function ($q, $window) {
      var deferred = $q.defer();
      var promise;

      var factory = {
        get: function () {
          if (!promise) {
            promise = deferred.promise;
            if (!$window.google.visualization) {
              $window.google.setOnLoadCallback(function () {
                deferred.resolve($window.google.visualization);
              });
            }
            else {
              deferred.resolve($window.google.visualization);
            }
          }
          return promise;
        }
      };
      return factory;

    }]);

})(angular);
