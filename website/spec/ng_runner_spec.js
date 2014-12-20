describe("RunnerCtrl", function() {

  var $rootScope = null;
  var controller = null;

  beforeEach(function() {
    module('CoderepoApp');
    inject(function($injector) {

      $rootScope = $injector.get('$rootScope');
      var $controller = $injector.get('$controller');

      var createController = function() {
        return $controller('RunnerCtrl', {'$scope' : $rootScope, '$http' : null });
      };

      controller = createController();
    });
  });

  describe("KeyMaker", function() {

    var keyMakerService = null;

    beforeEach(function() {
      inject(function($injector) {
        keyMakerService = $injector.get('KeyMaker');
      });
    });

    it("should get a valid key name for the object", function() {
      var object = {name:"hello", value:"whatup"};
      var keyForObject = keyMakerService.getKeyForObject(object);
      expect(keyForObject).toMatch(/^[0-9a-f]{10}_[0-9a-f]{40}$/);
    });

    it("should get two different keys for just slightly different objects", function() {
      var object1 = {name:"hello", value:"whatup"};
      var keyForObject1 = keyMakerService.getKeyForObject(object1);
      var object2 = {name:"hello!", value:"whatup"};
      var keyForObject2 = keyMakerService.getKeyForObject(object2);
      expect(keyForObject1).toNotEqual(keyForObject2);
    });

    it("should give the same value when hashing the same object during the same session", function() {
      var object = {name:"hello", value:"whatup"};
      var keyForObjectFirstRun = keyMakerService.getKeyForObject(object);
      var keyForObjectSecondRun = keyMakerService.getKeyForObject(object);
      expect(keyForObjectSecondRun).toEqual(keyForObjectFirstRun);
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
