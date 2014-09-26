/* jshint expr: true */

(function() {

  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);

  browser.driver.manage().window().setSize(1024, 768);

  describe("Widget Button Toolbar Component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/angular/widget-button-toolbar-test-ng.html");
    });

    // TODO: e2e tests to come

  });

})();
