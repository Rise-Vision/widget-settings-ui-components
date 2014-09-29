/* jshint expr: true */

(function() {

  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  var fs = require("fs");

  browser.driver.manage().window().setSize(1024, 768);

  describe("Widget Button Toolbar Component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/angular/widget-button-toolbar-test-ng.html");
    });

    it("should load correctly", function () {
      // save button should be enabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).
        to.eventually.be.false;

    });

    it("should execute save function on click", function () {
      element(by.css("button#save")).click();

      expect(element(by.id("testInput")).getAttribute("value")).
        to.eventually.equal("Save button clicked");
    });

    it("should execute cancel function on click", function () {
      element(by.css("button#cancel")).click();

      expect(element(by.id("testInput")).getAttribute("value")).
        to.eventually.equal("Cancel button clicked");
    });

    it("should execute disabling save button", function () {
      element(by.css("button#invalidTestBtn")).click();

      // save button should be disabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).
        to.eventually.be.true;
    });

    it("should execute enabling save button", function () {
      element(by.css("button#validTestBtn")).click();

      // save button should be disabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).
        to.eventually.be.false;
    });

  });

})();
