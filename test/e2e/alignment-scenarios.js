casper.test.begin("Testing alignment", function (test) {
  casper.start("http://localhost:8099/test/e2e/alignment-test.html", function () {
    test.assertTitle("Alignment - Test Page", "Test page has loaded");
    test.assertExists(".btn-alignment .glyphicon-align-left",
      "Icon is set to left align");
    test.assertExists(".btn-alignment[data-wysihtml5-command-value='left']",
      "Data attribute is set to 'left'");
    test.assertNotVisible(".dropdown-menu", "Dropdown is not visible");
  });

  // Open the dropdown menu.
  casper.then(function () {
    this.click(".btn-alignment");
    test.assertVisible(".dropdown-menu", "Dropdown is visible");
    test.assertElementCount(".dropdown-menu button", 4,
      "4 alignment options listed");
  });

  // Click on justify button.
  casper.then(function () {
    this.click(".dropdown-menu button[data-wysihtml5-command-value='justify']");
    test.assertExists(".btn-alignment .glyphicon-align-justify",
      "Icon is set to justify");
    test.assertNotVisible(".dropdown-menu", "Dropdown is not visible");
  });

  casper.run(function() {
    test.done();
  });
});
