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

    describe("Initialization", function() {
      it("Should collapse panel", function () {
        expect(element(by.css(".panel a.panel-heading.collapsed")).isPresent()).
          to.eventually.be.true;

        expect(element(by.css(".panel-collapse.collapse")).getCssValue("display"))
          .to.eventually.equal("none");
      });

      it("Should load font setting component", function () {
        expect(element(by.css("font-setting")).isPresent()).to.eventually.be.true;
      });

      it("Should disable Color Conditions", function () {
        expect(element(by.model("column.colorCondition")).isEnabled()).to.eventually.be.false;
      });
    });

    describe("Defaults", function() {
      it("Should set Numeric data column", function() {
        expect(element(by.model("column.numeric")).isSelected()).to.eventually.equal(false);
      });

      it("Should set Width", function() {
        expect(element(by.model("column.width")).getAttribute("value")).to.eventually.equal("100");
      });

      it("Should set Color Conditions", function() {
        expect(element(by.model("column.colorCondition")).getAttribute("value")).to.eventually.equal("none");
      });
    });

    describe("Visibility", function() {
      it("Should show panel when clicked", function () {
        element(by.css(".panel a.panel-heading.collapsed")).click();

        expect(element(by.css(".panel a.panel-heading.collapsed")).isPresent()).
          to.eventually.be.false;
        expect(element(by.css(".panel-collapse.collapse")).getCssValue("display"))
          .to.eventually.equal("block");
      });

      it("Should hide panel when clicked", function () {
        element(by.css(".panel a.panel-heading")).click();
        element(by.css(".panel a.panel-heading")).click();

        expect(element(by.css(".panel a.panel-heading.collapsed")).isPresent())
          .to.eventually.be.true;
        expect(element(by.css(".panel-collapse.collapse")).getCssValue("display"))
          .to.eventually.equal("none");
      });
    });

    describe("Enabling", function() {
      it("Should enable Color Conditions", function () {
        element(by.css(".panel a.panel-heading.collapsed")).click();
        element(by.model("column.numeric")).click();

        expect(element(by.model("column.colorCondition")).isEnabled()).to.eventually.be.true;
      });
    });
  });

})();
