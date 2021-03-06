(function() {

  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  var fs = require("fs");

  browser.driver.manage().window().setSize(1024, 768);

  describe("Column Selector component", function() {
    var ADDABLE_COLUMNS;

    beforeEach(function (){
      browser.get("/test/e2e/angular/column-selector-test-ng.html");
      ADDABLE_COLUMNS = 6;
    });

    it("Should correctly load default settings", function () {
      element.all(by.css(".enabled .column-selector option")).then(function (elements) {
        expect(elements.length).to.equal(ADDABLE_COLUMNS);
      });

      element.all(by.css(".enabled .panel-group div.panel.panel-default")).then(function (elements) {
        expect(elements.length).to.equal(2);
      });
    });

    it("Should enable dropdown", function() {
      expect(element(by.css(".enabled .column-selector[disabled=disabled")).isPresent()).to.eventually.be.false;
    });

    it("Should disable dropdown if ng-disabled is true", function() {
      expect(element(by.css(".disabled .column-selector[disabled=disabled")).isPresent()).to.eventually.be.true;
    });

    it("Should add an item when clicked", function (done) {
      element.all(by.css(".enabled .column-selector option")).then(function (elements) {
        elements[2].click();

        element.all(by.css(".enabled .column-selector option")).then(function (elements) {

          expect(elements.length).to.equal(ADDABLE_COLUMNS - 1);

          element.all(by.css(".enabled .panel-group div.panel.panel-default")).then(function (elements) {
            expect(elements.length).to.equal(3);

            done();
          });
        });
      });
    });

    it("Should remove an item when clicked", function () {
      element.all(by.css(".enabled .panel-group div.panel a.remove-column-button")).then(function (elements) {
        elements[0].click();

        element.all(by.css(".enabled .panel-group column-setting")).then(function (elements1) {
          expect(elements1.length).to.equal(1);
        });

        element.all(by.css(".enabled .column-selector option")).then(function(elements1) {
          expect(elements1.length).to.equal(ADDABLE_COLUMNS + 1);
        });
      });

    });

    it("Form should be invalid if all items are removed", function () {
      element.all(by.css(".enabled .panel-group div.panel a.remove-column-button")).then(function (elements) {
        elements[1].click();
        elements[0].click();

        expect(element(by.css("form[name=settingsform].ng-valid")).isPresent()).
          to.equal.false;

        expect(element(by.css("form[name=settingsform].ng-invalid")).isPresent()).
          to.equal.true;
      });
    });

    xit("Should correctly save settings", function (done) {
      //TODO
    });
  });

})();
