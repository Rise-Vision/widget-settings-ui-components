(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status")
    .directive("subscriptionStatus", ["$templateCache", "subscriptionStatusService",
    "$document", "$compile", "$rootScope",
      function ($templateCache, subscriptionStatusService, $document, $compile, $rootScope) {
      return {
        restrict: "AE",
        require: "?ngModel",
        scope: {
          productId: "@",
          productCode: "@",
          companyId: "@",
          expandedFormat: "@",
          showStoreModal: "=?"
        },
        template: $templateCache.get("subscription-status-template.html"),
        link: function($scope, elm, attrs, ctrl) {
          var storeModalInitialized = false;
          var storeAccountModalInitialized = false;

          $scope.subscriptionStatus = {"status": "N/A", "statusCode": "na", "subscribed": false, "expiry": null};

          $scope.$watch("companyId", function() {
            checkSubscriptionStatus();
          });

          $rootScope.$on("refreshSubscriptionStatus", function(event, data) {
            // Only refresh if currentStatus code matches the provided value, or value is null
            if(data === null || $scope.subscriptionStatus.statusCode === data) {
              checkSubscriptionStatus();
            }
          });

          function checkSubscriptionStatus() {
            if ($scope.productCode && $scope.productId && $scope.companyId) {
              subscriptionStatusService.get($scope.productCode, $scope.companyId).then(function(subscriptionStatus) {
                if (subscriptionStatus) {
                  if(!$scope.subscriptionStatus || $scope.subscriptionStatus.status !== subscriptionStatus.status) {
                    $rootScope.$emit("subscription-status:changed", subscriptionStatus);
                  }
                  
                  $scope.subscriptionStatus = subscriptionStatus;
                }
              },
              function () {
                // TODO: catch error here
              });
            }
          }

          if (ctrl) {
            $scope.$watch("subscriptionStatus", function(subscriptionStatus) {
              ctrl.$setViewValue(subscriptionStatus);
            });
          }

          var watch = $scope.$watch("showStoreModal", function(show) {
            if (show) {
              initStoreModal();

              watch();
            }
          });

          var watchAccount = $scope.$watch("showStoreAccountModal", function(show) {
            if (show) {
              initStoreAccountModal();

              watchAccount();
            }
          });

          $scope.$on("store-dialog-save", function() {
            checkSubscriptionStatus();
          });

          $scope.$on("store-dialog-close", function() {
            checkSubscriptionStatus();
          });

          function initStoreModal() {
            if (!storeModalInitialized) {
              var body = $document.find("body").eq(0);
              
              var angularDomEl = angular.element("<div store-modal></div>");
              angularDomEl.attr({
                "id": "store-modal",
                "animate": "animate",
                "show-store-modal": "showStoreModal",
                "company-id": "{{companyId}}",
                "product-id": "{{productId}}"
              });
              
              var modalDomEl = $compile(angularDomEl)($scope);
              body.append(modalDomEl);
              
              storeModalInitialized = true;
            }
          }

          function initStoreAccountModal() {
            if (!storeAccountModalInitialized) {
              var body = $document.find("body").eq(0);

              var angularDomEl = angular.element("<div store-account-modal></div>");
              angularDomEl.attr({
                "id": "store-account-modal",
                "animate": "animate",
                "show-store-account-modal": "showAccountStoreModal",
                "company-id": "{{companyId}}",
                "product-id": "{{productId}}"
              });

              var modalDomEl = $compile(angularDomEl)($scope);
              body.append(modalDomEl);

              storeAccountModalInitialized = true;
            }
          }
        }
      };
    }])
    .filter("to_trusted", ["$sce", function($sce) {
      return function(text) {
        return $sce.trustAsHtml(text);
      };
    }]);
}());
