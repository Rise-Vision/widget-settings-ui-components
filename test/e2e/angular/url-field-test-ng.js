/* jshint expr: true */

(function() {

  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  browser.driver.manage().window().setSize(1024, 768);

  describe("URL Field Component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/angular/url-field-test-ng.html");
    });

    it("Should correctly load", function () {
      // ensure validate checkbox is checked
      expect(element(by.css("input[name=validate-url]")).getAttribute("checked")).
        to.eventually.not.be.null;
      // ensure validate checkbox is not displayed
      expect(element(by.css("input[name=validate-url]")).isDisplayed()).to.eventually.be.false;
      // ensure no error message
      expect(element(by.css(".help-block")).isPresent()).
        to.eventually.be.false;
    });

    it("Should update input field via two-way binding", function () {
      element(by.id("setValidUrl")).click();

      expect(element(by.css("input[name=url]")).getAttribute("value")).
        to.eventually.equal("https://www.example.com/foo/?bar=baz&inga=42&quux");

      element(by.id("setInvalidUrl")).click();

      expect(element(by.css("input[name=url]")).getAttribute("value")).
        to.eventually.equal("http://a.b--c.de/");

    });

    it("Should provide checkbox to opt in or out of validating based on invalid URL entry", function () {
      element(by.id("setInvalidUrl")).click();

      // ensure validate checkbox is displayed
      expect(element(by.css("input[name=validate-url]")).isDisplayed()).to.eventually.be.true;
    });

    it("Should show and hide error message based on valid and invalid URL entry", function () {
      element(by.id("setValidUrl")).click();

      // ensure no error message
      expect(element(by.css(".help-block")).isPresent()).
        to.eventually.be.false;

      element(by.id("setInvalidUrl")).click();

      // ensure error message shown
      expect(element(by.css(".help-block")).isDisplayed()).
        to.eventually.be.true;

      element(by.id("setValidUrl")).click();

      // ensure no error message
      expect(element(by.css(".help-block")).isPresent()).
        to.eventually.be.false;
    });

    it("Should bypass validation when un-checking 'Validate-URL' checkbox ", function () {
      element(by.id("setInvalidUrl")).click();

      // ensure validate checkbox is displayed
      expect(element(by.css("input[name=validate-url]")).isDisplayed()).to.eventually.be.true;
      // ensure validate checkbox is checked
      expect(element(by.css("input[name=validate-url]")).getAttribute("checked")).
        to.eventually.not.be.null;

      element(by.css("input[name=validate-url]")).click();

      // ensure the checkbox has been unchecked
      expect(element(by.css("input[name=validate-url]")).getAttribute("checked")).
        to.eventually.be.null;
      // ensure no error message
      expect(element(by.css(".help-block")).isPresent()).
        to.eventually.be.false;

      element(by.id("setValidUrl")).click();

      element(by.id("setInvalidUrl")).click();

      // ensure no error message
      expect(element(by.css(".help-block")).isPresent()).
        to.eventually.be.false;

    });

    it("Should turn validation back on when re-checking 'Validate-URL' checkbox ", function () {
      element(by.id("setInvalidUrl")).click();

      element(by.css("input[name=validate-url]")).click();

      element(by.id("setValidUrl")).click();

      element(by.id("setInvalidUrl")).click();

      // ensure no error message
      expect(element(by.css(".help-block")).isPresent()).
        to.eventually.be.false;

      element(by.css("input[name=validate-url]")).click();

      // ensure error message shown
      expect(element(by.css(".help-block")).isDisplayed()).
        to.eventually.be.true;
    });

  });

})();
