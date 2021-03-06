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
      browser.get("/test/e2e/angular/scroll-setting-test-ng.html");
    });

    it("Should correctly load default defaults", function () {
      expect(element(by.id("scroll-by")).getAttribute("value")).to.eventually.equal("none");
    });

    it("Should display scroll settings when scroll is enabled", function () {
      expect(element(by.id("scroll-by")).getAttribute("value")).to.eventually.equal("none");

      element(by.cssContainingText('option', 'Continuously')).click();

      expect(element(by.id("scroll-by")).getAttribute("value")).to.eventually.equal("continuous");

      expect(element(by.id("scroll-direction")).getAttribute("value")).to.eventually.equal("up");

      expect(element(by.id("scroll-speed")).getAttribute("value")).to.eventually.equal("medium");

      expect(element(by.id("scroll-pause")).getAttribute("value")).to.eventually.equal("5");

      expect(element(by.id("scroll-pud")).getAttribute("value")).to.eventually.equal("10");
    });

    it("Should NOT display direction setting when scroll is page", function () {
      expect(element(by.id("scroll-by")).getAttribute("value")).to.eventually.equal("none");

      element(by.cssContainingText('option', 'Page')).click();

      expect(element(by.id("scroll-direction")).isDisplayed()).to.eventually.be.false;
    });

    it("Should only show speed when direction is set to left", function () {

      element(by.cssContainingText('option', 'Continuously')).click();

      element(by.cssContainingText('option', 'Left')).click();

      expect(element(by.id("scroll-by")).getAttribute("value")).to.eventually.equal("continuous");

      expect(element(by.id("scroll-direction")).getAttribute("value")).to.eventually.equal("left");

      expect(element(by.id("scroll-speed")).getAttribute("value")).to.eventually.equal("medium");

      expect(element(by.id("scroll-pause")).isDisplayed()).to.eventually.be.false;

      expect(element(by.id("scroll-pud")).isDisplayed()).to.eventually.be.false;
    });


    it("Should NOT display direction setting when scroll is set to hide direction and clicked on Continuously", function () {
      expect(element(by.css("#direction-hidden #scroll-by")).getAttribute("value")).to.eventually.equal("none");

      element(by.cssContainingText('option', 'Continuously')).click();

      expect(element(by.css("#direction-hidden #scroll-direction")).isDisplayed()).to.eventually.be.false;
    });

    it("Should NOT display direction setting when scroll is set to hide direction and clicked on By Page", function () {
      expect(element(by.css("#direction-hidden #scroll-by")).getAttribute("value")).to.eventually.equal("none");

      element(by.cssContainingText('option', 'Page')).click();

      expect(element(by.css("#direction-hidden #scroll-direction")).isDisplayed()).to.eventually.be.false;
    });

  });

})();
