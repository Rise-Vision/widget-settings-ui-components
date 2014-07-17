casper.test.begin("Testing URL Field", function (test) {
  casper.start("http://localhost:8099/test/e2e/url-field-test.html", function () {
    test.assertTitle("URL Field - Test Page", "Page title is the one expected");
    test.assertExists("input[name='url']","URL input field exists");
    test.assertEval(function () {
      return document.querySelector("input[name='url']").value === "http://";
    }, "Default url value is http://");
    test.assertNotVisible(".validate-url", "Validate URL container is not visible");
  });

  casper.run(function() {
    test.done();
  });
});
