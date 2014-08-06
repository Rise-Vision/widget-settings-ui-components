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
    beforeEach(function (){
      browser.get("/test/e2e/angular/column-selector-test-ng.html");
    });

    it("Should correctly load default settings", function () {
      element.all(by.css(".tags span.label")).then(function (elements) {
        expect(elements.length).to.equal(7);

        expect(elements[1].getCssValue("display")).to.eventually.equal("none");

        expect(elements[2].getText()).to.eventually.equal("columns.last-price");
      });

      element.all(by.css(".panel-group div.panel.panel-default")).then(function (elements) {
        expect(elements.length).to.equal(2);
      });
    });

    it("Should add an item when clicked", function () {
      element.all(by.css(".tags span.label")).then(function (elements) {
        elements[2].click();

        expect(elements[2].getCssValue("display")).to.eventually.equal("none");

        element.all(by.css(".panel-group div.panel.panel-default")).then(function (elements) {
          expect(elements.length).to.equal(3);
        });
      });
    });

    it("Should remove an item when clicked", function () {
      element.all(by.css(".panel-group div.panel a.glyphicon")).then(function (elements) {
        elements[0].click();

        element.all(by.css(".panel-group column-setting")).then(function (elements1) {
          expect(elements1.length).to.equal(1);
        });

        element.all(by.css(".tags span.label")).then(function(elements1) {
          expect(elements1[0].getCssValue("display")).to.eventually.equal("inline-block");
        });
      });

    });

    xit("Should correctly save settings", function (done) {
      //TODO
    });
  });

})();
