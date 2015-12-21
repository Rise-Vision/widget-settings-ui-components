(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status")
    .directive("storeModal", ["$templateCache", "$location", "gadgetsApi", "STORE_URL", "IN_RVA_PATH",
      function ($templateCache, $location, gadgetsApi, STORE_URL, IN_RVA_PATH) {
        return {
          restrict: "AE",
          scope: {
            showStoreModal: "=",
            productId: "@",
            companyId: "@"
          },
          template: $templateCache.get("store-modal-template.html"),
          link: function($scope, elm) {
            var $elm = $(elm);
            $scope.showStoreModal = true;
            
            function registerRPC() {
              if (!$scope.rpcRegistered && gadgetsApi) {
                $scope.rpcRegistered = true;
                
                gadgetsApi.rpc.register("rscmd_saveSettings", saveSettings);
                gadgetsApi.rpc.register("rscmd_closeSettings", closeSettings);

                gadgetsApi.rpc.setupReceiver("store-modal-frame");
              }
            }
            
            function saveSettings() {
              $scope.$emit("store-dialog-save");
              
              closeSettings();
            }

            function closeSettings() {
              $scope.$emit("store-dialog-close");

              $scope.$apply(function() {
                $scope.showStoreModal = false;
              });
            }
            
            $scope.$watch("showStoreModal", function(showStoreModal) {
              if (showStoreModal) {
                registerRPC();
                
                var url = STORE_URL + IN_RVA_PATH
                  .replace("productId", $scope.productId)
                  .replace("companyId", $scope.companyId)
                  .replace("iframeId", "store-modal-frame")
                  .replace("parentUrl", encodeURIComponent($location.$$absUrl));
                                
                $elm.find("#store-modal-frame").attr("src", url);
                
              }
            });            
          }
        };
    }]);
}());
  
