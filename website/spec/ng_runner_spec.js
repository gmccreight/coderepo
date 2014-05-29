describe("RunnerCtrl", function() {

  var $rootScope = null;
  var controller = null;

  beforeEach(function() {
    module('CodefluentApp');
    inject(function($injector) {

      $rootScope = $injector.get('$rootScope');
      var $controller = $injector.get('$controller');

      var createController = function() {
        return $controller('RunnerCtrl', {'$scope' : $rootScope, '$http' : null });
      };

      controller = createController();
    });
  });

  describe("after run", function() {

    describe("where the tests passed", function() {

      it("should show a message about how the code was run", function() {
        expect($rootScope.showHowWasRun()).toEqual(false);
        $rootScope.setDidPass(true);
        expect($rootScope.showHowWasRun()).toEqual(true);
      });

    });

  });

});
