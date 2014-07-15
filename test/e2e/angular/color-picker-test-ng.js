(function() {

  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  var fs = require("fs");

  browser.driver.manage().window().setSize(1024, 768);

  describe("Color Picker component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/angular/color-picker-test-ng.html");
    });

    it("Check Color Picker is loaded", function () {
      expect(element(by.id('color-picker')).getCssValue("display")).
        to.eventually.equal('none');

      expect(element(by.css('.sp-replacer.sp-light')).isPresent()).
        to.eventually.be.true;
    });

    it("Should show Color Picker default color when clicked", function () {
      element(by.css('.sp-replacer.sp-light')).click();

      expect(element(by.css('.sp-replacer.sp-light.sp-active')).isPresent()).
        to.eventually.be.true;

      expect(element(by.css('.sp-preview-inner')).getCssValue("background-color")).
        to.eventually.equal("rgba(0, 0, 0, 0)");
    });

    it("Should close dialogue when Close is clicked", function() {
      element(by.css('.sp-replacer.sp-light')).click();
      element(by.css('.sp-cancel')).click();

      expect(element(by.css('.sp-replacer.sp-light.sp-active')).isPresent()).
        to.eventually.be.false;
    });

    xit("Should select Color when clicked", function () {
      //TODO
    });

    xit("Should correctly save settings", function (done) {
      //TODO
    });
  });

})();
