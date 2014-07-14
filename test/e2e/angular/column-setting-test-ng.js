(function() {

  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  var fs = require("fs");

  browser.driver.manage().window().setSize(1024, 768);

  describe("Column Setting component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/angular/column-setting-test-ng.html");
    });

    it("Should correctly load default defaults", function () {
      //scroll enabled
      expect(element(by.id("column-alignment")).getAttribute("value")).
        to.eventually.equal("left");

      expect(element(by.id("column-width")).getAttribute("value")).
      to.eventually.equal("0");

      expect(element(by.id("column-decimals")).getAttribute("value")).
      to.eventually.equal("0");

      expect(element(by.id("column-sign")).getAttribute("value")).
      to.eventually.equal("arrow");

      expect(element(by.id("column-color-condition")).getAttribute("value")).
      to.eventually.equal("none");
    });

    xit("Should correctly save settings", function (done) {
      //TODO
    });
  });

})();
