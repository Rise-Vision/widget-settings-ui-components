(function() {
  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");
  var expect = chai.expect;

  chai.use(chaiAsPromised);
  browser.driver.manage().window().setSize(1024, 768);

  describe("Alignment", function() {
    beforeEach(function () {
      browser.get("/test/e2e/angular/alignment-test-ng.html");
    });

    it("Should load", function () {
      expect(element(by.css(".btn-alignment .glyphicon-align-left"))
        .isPresent()).to.eventually.be.true;

      expect(element(by.css(
        ".btn-alignment[data-wysihtml5-command-value='left']")).isPresent())
        .to.eventually.be.true;

      expect(element(by.css(".dropdown-menu")).isDisplayed())
        .to.eventually.be.false;
    });

    // Open the dropdown menu.
    it("Should show 4 items in the dropdown when clicked", function () {
      element(by.css(".btn-alignment")).click();

      expect(element(by.css(".dropdown-menu")).isDisplayed()).
        to.eventually.be.true;

      expect(element.all(by.css(".dropdown-menu button")).count())
        .to.eventually.equal(4);
    });

    // Click on justify button.
    it("Should set the icon to justify when icon is clicked", function () {
      element(by.css(".btn-alignment")).click();
      element(by.css(
        ".dropdown-menu button[data-wysihtml5-command-value='justify']"))
        .click();

      expect(element(by.css(".btn-alignment .glyphicon-align-justify"))
        .isPresent()).to.eventually.be.true;

      expect(element(by.css(".dropdown-menu")).isDisplayed()).
        to.eventually.be.false;
    });
  });
})();
