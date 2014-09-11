var system = require('system');
var e2ePort = system.env.E2E_PORT || 8099;
var testUrl = "http://localhost:"+e2ePort+"/test/e2e/url-field-test.html";

casper.test.begin("URL Field: Initialize", function (test) {
  casper.start(testUrl, function () {
    test.assertTitle("URL Field - Test Page", "Page title is the one expected");
    test.assertExists("input[name='url']","URL input field exists");
    test.assertEval(function () {
      return document.querySelector("input[name='url']").value === "http://";
    }, "Default url value is http://");
    test.assertNotVisible(".validate-url", "'Validate URL' checkbox is not visible");
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("URL Field: Enter a valid URL", function (test) {
  casper.start(testUrl);

  casper.then(function () {
    this.click("button#setValidUrl");
    this.click("button#validate");
    test.assertSelectorHasText(".alert","URL is valid!", "URL should be valid");
    test.assertNotVisible(".validate-url", "'Validate URL' checkbox is not visible");
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("URL Field: Enter an invalid URL", function (test) {
  casper.then(function () {
    this.click("button#setInvalidUrl");
    this.click("button#validate");
    test.assertSelectorHasText(".alert","URL is invalid.", "URL should be invalid");
    test.assertVisible(".validate-url", "'Validate URL' checkbox is visible");
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("URL Field: Uncheck 'Validate URL' checkbox", function (test) {
  casper.then(function () {
    this.click("button#setInvalidUrl");
    this.click("button#validate");
    this.click("input[name='validate-url']");
    this.click("button#validate");
    test.assertSelectorHasText(".alert","URL is valid!", "URL should be valid");
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("URL Field: Check 'Validate URL' checkbox", function (test) {
  casper.then(function () {
    this.click("button#setInvalidUrl");
    this.click("button#validate");
    this.click("input[name='validate-url']");
    this.click("button#validate");
    this.click("input[name='validate-url']");
    this.click("button#validate");
    test.assertSelectorHasText(".alert","URL is valid!", "URL should be invalid");
  });

  casper.run(function() {
    test.done();
  });
});
