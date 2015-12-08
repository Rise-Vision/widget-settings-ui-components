/* jshint expr: true */

(function() {

  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  browser.driver.manage().window().setSize(1024, 768);

  describe("File Selector Component", function() {

    beforeEach(function (){
      browser.get("/test/e2e/angular/file-selector-test-ng.html");
    });

    describe("** Standard functionality **", function () {

      it("Should correctly load", function () {
        // Buttons should not be in selected state
        expect(element(by.css("#main storage-selector[type='single-file'] button.active")).isPresent()).to.eventually.be.false;
        expect(element(by.css("#main storage-selector[type='single-folder'] button.active")).isPresent()).to.eventually.be.false;
        expect(element(by.css("#main button[name='customBtn'].active")).isPresent()).to.eventually.be.false;

        // Storage input fields should not be present
        expect(element(by.css("#main input[name='storage-file-name']")).isPresent()).to.eventually.be.false;
        expect(element(by.css("#main input[name='storage-folder-name']")).isPresent()).to.eventually.be.false;

        // Custom URL Field not present
        expect(element(by.css("#main #customUrl input[name='url']")).isPresent()).to.eventually.be.false;

        // Subscription Status component is present
        expect(element(by.css("#main div[subscription-status]")).isPresent()).to.eventually.be.true;
        // Subscription Status component is not displayed
        expect(element(by.css("#main div[subscription-status]")).isDisplayed()).to.eventually.be.false;
      });

      it("Should correctly handle storage file selection", function () {
        var fileUrl = "https://storage.googleapis.com/risemedialibrary-abc123/test%2Fvideos%2Ftest.webm";

        element(by.id("singleFileCorrectPick")).click();

        // Button showing selected state
        expect(element(by.css("#main storage-selector[type='single-file'] button.active")).isPresent()).to.eventually.be.true;

        // Field is displayed
        expect(element(by.css("#main input[name='storage-file-name']")).isPresent()).to.eventually.be.true;
        expect(element(by.css("#main input[name='storage-file-name']")).isDisplayed()).to.eventually.be.true;

        // Storage File name is displayed
        expect(element(by.css("#main input[name='storage-file-name']")).getAttribute("value")).
          to.eventually.equal("test/videos/test.webm");

        // No error message, correct file type chosen
        expect(element(by.css("#main .text-danger")).isPresent()).to.eventually.be.false;

        // Preview button shown
        expect(element(by.css("#main button[name='previewBtn']")).isPresent()).to.eventually.be.true;
        expect(element(by.css("#main button[name='previewBtn']")).isDisplayed()).to.eventually.be.true;

        // Clicking preview button launches new tab with correct url
        element(by.css("#main button[name='previewBtn']")).click().then(function () {
          browser.getAllWindowHandles().then(function (handles) {
            var newWindowHandle = handles[1];
            browser.switchTo().window(newWindowHandle).then(function () {
              expect(browser.driver.getCurrentUrl()).to.eventually.equal(fileUrl);
            });
          });
        });
      });

      it("Should show error message when a storage file selected is not of correct file type", function () {
        element(by.id("singleFileWrongPick")).click();

        expect(element(by.css("#main .text-danger")).isPresent()).to.eventually.be.true;
      });

      it("Should correctly handle storage folder selection", function () {
        element(by.id("singleFolderPick")).click();

        // Button showing selected state
        expect(element(by.css("#main storage-selector[type='single-folder'] button.active")).isPresent()).to.eventually.be.true;

        // Field is displayed
        expect(element(by.css("#main input[name='storage-folder-name']")).isPresent()).to.eventually.be.true;
        expect(element(by.css("#main input[name='storage-folder-name']")).isDisplayed()).to.eventually.be.true;

        // Storage Folder name is displayed
        expect(element(by.css("#main input[name='storage-folder-name']")).getAttribute("value")).
          to.eventually.equal("test/videos/");

        // No error message, validation not required
        expect(element(by.css("#main .text-danger")).isPresent()).to.eventually.be.false;

        // Preview button not shown, not required
        expect(element(by.css("#main button[name='previewBtn']")).isPresent()).to.eventually.be.false;

      });

      it("Should correctly provide custom input", function () {
        element(by.css("#main button[name='customBtn']")).click();

        // Button showing selected state
        expect(element(by.css("#main button[name='customBtn'].active")).isPresent()).to.eventually.be.true;

        // URL Field is displayed
        expect(element(by.css("#main #customUrl input[name='url']")).isPresent()).to.eventually.be.true;
        expect(element(by.css("#main #customUrl input[name='url']")).isDisplayed()).to.eventually.be.true;

        // Storage fields aren't present
        expect(element(by.css("#main input[name='storage-file-name']")).isPresent()).to.eventually.be.false;
        expect(element(by.css("#main input[name='storage-folder-name']")).isPresent()).to.eventually.be.false;

        // Preview button not present
        expect(element(by.css("#main button[name='previewBtn']")).isPresent()).to.eventually.be.false;

        // No error message, URL Field initially valid with empty value
        expect(element(by.css("#main .text-danger")).isPresent()).to.eventually.be.false;
      });

      it("Should display subscription status when not subscribed", function () {
        element(by.id("singleFolderPick")).click();
        element(by.id("subscriptionExpired")).click();

        // Subscription Status component is displayed due to no storage subscription
        expect(element(by.css("#main div[subscription-status]")).isDisplayed()).to.eventually.be.true;
      });

      it("Should not display subscription status when custom URL is selected", function () {
        element(by.css("#main button[name='customBtn']")).click();
        element(by.id("subscriptionExpired")).click();

        // Subscription Status component is displayed due to no storage subscription
        expect(element(by.css("#main div[subscription-status]")).isDisplayed()).to.eventually.be.false;
      });

    });

    describe("** Hide Subscription Status **", function () {

      it("Should not display subscription status component regardless of subscription status", function () {
        // Subscription Status component is present
        expect(element(by.css("#hideSubscription div[subscription-status]")).isPresent()).to.eventually.be.true;
        // Subscription Status component is not displayed
        expect(element(by.css("#hideSubscription div[subscription-status]")).isDisplayed()).to.eventually.be.false;

        element(by.id("subscriptionExpired")).click();

        // Subscription Status component is not displayed
        expect(element(by.css("#hideSubscription div[subscription-status]")).isDisplayed()).to.eventually.be.false;
      });

    });

  });

})();
