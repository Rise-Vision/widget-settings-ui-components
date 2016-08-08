(function () {
  "use strict";

  try {
  	angular.module("risevision.common.config");
  }
  catch(err) {
  	angular.module("risevision.common.config", []);
  }

  angular.module("risevision.common.config")
    .value("STORE_URL", "https://store.risevision.com/")
    .value("STORE_SERVER_URL", "https://store-dot-rvaserver2.appspot.com/")
  ;

  angular.module("risevision.widget.common.subscription-status.config", [])
    .value("IN_RVA_PATH", "product/productId/?cid=companyId")
    .value("ACCOUNT_PATH", "account?cid=companyId")
    .value("PATH_URL", "v1/company/companyId/product/status?pc=")
    .value("AUTH_PATH_URL", "v1/widget/auth?cid=companyId&pc=")
  ;

}());
