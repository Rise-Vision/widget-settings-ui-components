(function() {

  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  var fs = require("fs");

  browser.driver.manage().window().setSize(1024, 768);

  describe("Scroll Setting component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/test-ng.html");
    });

    it("Should correctly load default defaults", function () {
      //scroll enabled
      expect(element(by.id("scroll-enabled")).getAttribute("checked")).
        to.eventually.not.be.ok;

      expect(element(by.css(".more-scroll-options")).isDisplayed()).to.eventually.be.false;
    });

    it("Should display scroll settings when scroll is enabled", function () {
      expect(element(by.id("scroll-enabled")).getAttribute("checked")).
        to.eventually.not.be.ok;
      expect(element(by.css(".more-scroll-options")).isDisplayed()).to.eventually.be.false;
      //click on option, additional options appear
      element(by.id("scroll-enabled")).click();
      expect(element(by.css(".more-scroll-options")).isDisplayed()).to.eventually.be.true;
    });

    xit("Should correctly save settings", function (done) {
      //TODO
    });
  });

})();
