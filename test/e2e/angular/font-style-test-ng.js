(function() {
  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");
  var expect = chai.expect;

  chai.use(chaiAsPromised);
  browser.driver.manage().window().setSize(1024, 768);

  describe("Font Style", function() {
    beforeEach(function () {
      browser.get("/test/e2e/angular/font-style-test-ng.html");
    });

    it("Should load", function () {
      expect(element(by.css(".bold.active")).isPresent()).
        to.eventually.be.true;

      expect(element(by.css(".italic.active")).isPresent()).
        to.eventually.be.true;

      expect(element(by.css(".underline.active")).isPresent()).
        to.eventually.be.true;
    });

    // Bold
    it("Should turn bold off when clicked", function () {
      element(by.css(".bold")).click();

      expect(element(by.css(".bold.active")).isPresent()).
        to.eventually.be.false;
    });

    // Italic
    it("Should turn italic off when clicked", function () {
      element(by.css(".italic")).click();

      expect(element(by.css(".italic.active")).isPresent()).
        to.eventually.be.false;
    });

    // Underline
    it("Should turn underline off when clicked", function () {
      element(by.css(".underline")).click();

      expect(element(by.css(".underline.active")).isPresent()).
        to.eventually.be.false;
    });
  });
})();
