(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status")
    .directive("storeAccountModal", ["$templateCache", "$location", "gadgetsApi", "STORE_URL", "IN_RVA_ACCOUNT_PATH",
      function ($templateCache, $location, gadgetsApi, STORE_URL, IN_RVA_ACCOUNT_PATH) {
        return {
          restrict: "AE",
          scope: {
            showStoreAccountModal: "=",
            productId: "@",
            companyId: "@"
          },
          template: $templateCache.get("store-account-modal-template.html"),
          link: function($scope, elm) {
            var $elm = $(elm);
            $scope.showStoreAccountModal = true;
            
            function registerRPC() {
              if (!$scope.rpcRegistered && gadgetsApi) {
                $scope.rpcRegistered = true;
                
                gadgetsApi.rpc.register("rscmd_saveSettings", saveSettings);
                gadgetsApi.rpc.register("rscmd_closeSettings", closeSettings);

                gadgetsApi.rpc.setupReceiver("store-account-modal-frame");
              }
            }
            
            function saveSettings() {
              $scope.$emit("store-dialog-save");
              
              closeSettings();
            }

            function closeSettings() {
              $scope.$apply(function() {
                $scope.showStoreAccountModal = false;
              });        
            }
            
            $scope.$watch("showStoreAccountModal", function(showStoreAccountModal) {
              if (showStoreAccountModal) {
                registerRPC();
                
                var url = STORE_URL + IN_RVA_ACCOUNT_PATH
                  .replace("productId", $scope.productId)
                  .replace("companyId", $scope.companyId)
                  .replace("iframeId", "store-account-modal-frame")
                  .replace("parentUrl", encodeURIComponent($location.$$absUrl));
                                
                $elm.find("#store-account-modal-frame").attr("src", url);
                
              }
            });
          }
        };
    }]);
}());
