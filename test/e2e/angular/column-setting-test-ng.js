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

    it("Should correctly load default settings", function () {
      expect(element(by.css(".panel a.panel-title.collapsed")).isPresent()).
        to.eventually.be.true;

      expect(element(by.css(".panel-collapse.collapse")).getCssValue("display"))
        .to.eventually.equal("none");

      expect(element(by.css(".btn-alignment[data-wysihtml5-command-value='left']"))).
      to.eventually.not.be.null;

      expect(element(by.id("column-width")).getAttribute("value")).
      to.eventually.equal("100px");

      expect(element(by.id("column-decimals")).getAttribute("value")).
      to.eventually.equal("0");

      expect(element(by.id("column-sign")).getAttribute("value")).
      to.eventually.equal("arrow");

      expect(element(by.id("column-color-condition")).getAttribute("value")).
      to.eventually.equal("none");
    });

    it("Should correctly load text column type", function () {
      element(by.id("setTextColumn")).click();

      expect(element(by.id("column-decimals")).isPresent()).
        to.eventually.be.false;

      expect(element(by.id("column-sign")).isPresent()).
        to.eventually.be.false;

      expect(element(by.id("column-color-condition")).isPresent()).
        to.eventually.be.false;
    });

    it("Should show panel when clicked", function () {
      element(by.css(".panel a.panel-title.collapsed")).click();

      expect(element(by.css(".panel a.panel-title.collapsed")).isPresent()).
        to.eventually.be.false;

      expect(element(by.css(".panel-collapse.collapse")).getCssValue("display"))
        .to.eventually.equal("block");
    });

    it("Should hide panel when clicked", function () {
      element(by.css(".panel a.panel-title")).click();
      element(by.css(".panel a.panel-title")).click();

      expect(element(by.css(".panel a.panel-title.collapsed")).isPresent())
        .to.eventually.be.true;

      expect(element(by.css(".panel-collapse.collapse")).getCssValue("display"))
        .to.eventually.equal("none");
    });

    xit("Should correctly save settings", function (done) {
      //TODO
    });
  });

})();
