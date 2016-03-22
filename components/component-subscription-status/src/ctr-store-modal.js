(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status")
    .controller("StoreModalController", ["$scope", "$rootScope", "$timeout", 
      "$modalInstance", "$location", "$sce", "gadgetsApi", 
      "STORE_URL", "IN_RVA_PATH", "productId", "companyId",
      function ($scope, $rootScope, $timeout, $modalInstance, $location, $sce,
        gadgetsApi, STORE_URL, IN_RVA_PATH, productId, companyId) {

        var getStoreUrl = function() {  
          var url = STORE_URL + IN_RVA_PATH
            .replace("productId", productId)
            .replace("companyId", companyId)
            .replace("iframeId", "store-modal-iframe")
            .replace("parentUrl", encodeURIComponent($location.$$absUrl));
                          
          return $sce.trustAsResourceUrl(url);
        };
        $scope.url = getStoreUrl();
        
        var saveSettings = function() {
          $modalInstance.close();
        };

        var closeSettings = function() {
          $modalInstance.dismiss();
        };

        var registerRPC = function() {
          if (gadgetsApi) {
            $timeout(function() {
              gadgetsApi.rpc.register("rscmd_saveSettings", saveSettings);
              gadgetsApi.rpc.register("rscmd_closeSettings", closeSettings);

              gadgetsApi.rpc.setupReceiver("store-modal-iframe");
            });
          }
        };
        registerRPC();
    }]);
}());
  
