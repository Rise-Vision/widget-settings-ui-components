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
      expect(element(by.css("input[name=validate-url]:checked")).getAttribute("checked")).
        to.eventually.not.be.null;
      // ensure validate checkbox is not displayed
      expect(element(by.css(".validate-url")).isDisplayed()).to.eventually.be.false;

      expect(element(by.css("input[name=url]")).getAttribute("value")).
        to.eventually.equal("http://");
    });

    it("Should update input field via two-way binding", function () {
      element(by.id("setValidUrl")).click();

      expect(element(by.css("input[name=url]")).getAttribute("value")).
        to.eventually.equal("https://www.example.com/foo/?bar=baz&inga=42&quux");

      element(by.id("setInvalidUrl")).click();

      expect(element(by.css("input[name=url]")).getAttribute("value")).
        to.eventually.equal("http://a.b--c.de/");

    });

    xit("Should validate URL and provide checkbox to opt in or out of validating", function (done) {
      // TODO: Need a settings validation scheme
    });

    xit("Should correctly save settings", function (done) {
      //TODO
    });

  });

})();
