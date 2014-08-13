/* jshint expr: true */

(function() {

  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  browser.driver.manage().window().setSize(1024, 768);

  describe("Background Component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/angular/background-setting-test-ng.html");
    });

    it("Should correctly load defaults", function () {
      expect(element(by.css("input[color-picker]")).getCssValue("display")).
        to.eventually.equal("none");

      expect(element(by.css(".sp-replacer.sp-light")).isPresent()).
        to.eventually.be.true;
    });

    it("Should show Color Picker default color when clicked", function () {
      element(by.css(".sp-replacer.sp-light")).click();

      expect(element(by.css(".sp-replacer.sp-light.sp-active")).isPresent()).
        to.eventually.be.true;

      expect(element(by.css(".sp-preview-inner")).getCssValue("background-color")).
        to.eventually.equal("rgba(0, 0, 0, 0)");
    });

    it("Should force Color Picker with a color via two way binding", function () {
      element(by.id("btnSolid")).click();

      expect(element(by.css(".sp-preview-inner")).getCssValue("background-color")).
        to.eventually.equal("rgba(252, 238, 0, 1)");
    });

    it("Should force Color Picker to be transparent via two way binding", function () {
      element(by.id("btnTrans")).click();

      expect(element(by.css(".sp-preview-inner")).getCssValue("background-color")).
        to.eventually.equal("rgba(0, 0, 0, 0)");
    });

  });

})();
