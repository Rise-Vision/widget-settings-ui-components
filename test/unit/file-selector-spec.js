/*jshint expr:true */
"use strict";

describe("Unit Tests - File Selector", function () {

  var scope, rootScope;

  beforeEach(module("risevision.widget.common.file-selector"));

  beforeEach(inject(function($injector, $rootScope, $compile) {
    scope = $rootScope.$new();
    rootScope = $rootScope;

    $compile('<file-selector file-label="File" folder-label="Folder" file-type="image" ' +
      ' selector="selector"></file-selector>')(scope);

    scope.selector = {};
    scope.$digest();
  }));

  describe("fileSelectorClick", function() {
    it("Should emit event with custom parameter", function() {
      var spy = sinon.spy(rootScope, "$broadcast");

      scope.selector.selection = "custom";
      scope.$digest();

      expect(spy).to.have.been.calledWith("fileSelectorClick", "custom");

      rootScope.$broadcast.restore();
    });

    it("Should emit event with single-file parameter", function() {
      var spy = sinon.spy(rootScope, "$broadcast");

      scope.selector.selection = "single-file";
      scope.$digest();

      expect(spy).to.have.been.calledWith("fileSelectorClick", "single-file");

      rootScope.$broadcast.restore();
    });

    it("Should emit event with single-folder parameter", function() {
      var spy = sinon.spy(rootScope, "$broadcast");

      scope.selector.selection = "single-folder";
      scope.$digest();

      expect(spy).to.have.been.calledWith("fileSelectorClick", "single-folder");

      rootScope.$broadcast.restore();
    });
  });
});
