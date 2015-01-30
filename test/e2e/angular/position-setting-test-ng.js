/* jshint expr: true */

(function() {

  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  var fs = require("fs");

  browser.driver.manage().window().setSize(1024, 768);

  describe("Position Setting Component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/angular/position-setting-test-ng.html");
    });

    describe("** Standard functionality **", function () {

      it("Should correctly load", function () {
        expect(element(by.css("#main select[name='position']")).isPresent()).to.eventually.be.true;
        expect(element(by.css("#main select[name='position']")).isDisplayed()).to.eventually.be.true;
        expect(element(by.css("#main label")).isPresent()).to.eventually.be.true;
      });

      it("Should correctly load with default selection", function () {
        element.all(by.css("#main select[name='position'] option")).then(function (elements) {
          // select element should display 9 options
          expect(elements.length).to.equal(9);
        });

        // select element should have correct default option selected
        expect(element(by.css("#main select[name='position']")).$('option:checked').getAttribute("value"))
          .to.eventually.equal("top-left");

        // ng-model 'position' value should be bound to select element and have the correct value
        expect(element(by.css("#main select[name='position']")).getAttribute("value")).to.eventually.equal("top-left");
      });

      it("Should update the position model value by selecting a different option", function () {
        element(by.css("#main select[name='position']")).click();
        element(by.css("#main select[name='position'] option[value='middle-right']")).click();

        // ng-model 'position' value should be bound to select element and have the correct value
        expect(element(by.css("#main select[name='position']")).getAttribute("value")).to.eventually.equal("middle-right");
      });
    });

    describe("** Hiding functionality **", function () {

      it("Should hide the label", function () {
        expect(element(by.css("#hiding label")).isPresent()).to.eventually.be.false;
      });

    });

  });

})();
