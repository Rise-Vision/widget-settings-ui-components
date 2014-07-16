(function() {

  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  var fs = require("fs");

  browser.driver.manage().window().setSize(1024, 768);

  describe("Table Format component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/angular/table-format-test-ng.html");
    });

    it("Should correctly load default defaults", function () {
      expect(element(by.id("row-padding")).getAttribute("value")).
      to.eventually.equal("0");

      expect(element(by.id("col-padding")).getAttribute("value")).
      to.eventually.equal("0");

    });

    xit("Should correctly save settings", function (done) {
      //TODO
    });
  });

})();
