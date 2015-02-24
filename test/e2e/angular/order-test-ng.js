/* jshint expr: true */

(function() {

  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  var fs = require("fs");

  browser.driver.manage().window().setSize(1024, 768);

  describe("Order Setting Component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/angular/order-test-ng.html");
    });

    it("Should correctly load", function () {
      expect(element(by.css("select[name='order']")).isPresent()).to.eventually.be.true;
      expect(element(by.css("select[name='order']")).isDisplayed()).to.eventually.be.true;
      expect(element(by.css("label")).isPresent()).to.eventually.be.true;
    });

    it("Should correctly load with default selection", function () {
      element.all(by.css("select[name='order'] option")).then(function (elements) {
        // select element should display 9 options
        expect(elements.length).to.equal(5);
      });

      // select element should have correct default option selected
      expect(element(by.css("select[name='order']")).$('option:checked').getAttribute("value"))
        .to.eventually.equal("alpha-asc");

      // ng-model 'order' value should be bound to select element and have the correct value
      expect(element(by.css("select[name='order']")).getAttribute("value")).to.eventually.equal("alpha-asc");
    });

    it("Should update the order model value by selecting a different option", function () {
      element(by.css("select[name='order']")).click();
      element(by.css("select[name='order'] option[value='date-desc']")).click();

      // ng-model 'order' value should be bound to select element and have the correct value
      expect(element(by.css("select[name='order']")).getAttribute("value")).to.eventually.equal("date-desc");
    });

  });

})();
