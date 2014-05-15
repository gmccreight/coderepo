window.codeFluentApp = angular.module('CodeFluentApp', []);

window.codeFluentApp.controller("RunnerCtrl", function ($scope, $http) {

  $scope.error = "";
  $scope.files = undefined;
  $scope.currentFile = undefined;
  $scope.isRunning = false;

  $scope.init = function() {
    $scope.files = $scope.templateFor().files;
    $scope.currentFile = $scope.files[0].name;
  };

  $scope.hasError = function() {
    return $scope.error != "";
  };

  $scope.setError = function(message) {
    $scope.error = message;
  };

  $scope.setDidPass = function(didPass) {
    $scope.didPass = didPass;
  };

  $scope.setIsRunning = function(isRunning) {
    $scope.isRunning = isRunning;
  };

  $scope.runCode = function() {
    $scope.setError("");
    $scope.setDidPass(false);
    $scope.setIsRunning(true);
    var successCallback = function(data, status, headers, config) {
      $scope.setIsRunning(false);
      if (data.error) {
        $scope.setError(data.error);
      }
      else {
        if (data.did_pass) {
          $scope.setDidPass(true);
        }
        else {
          $scope.setError(data.stdout + data.stderr);
        }
      }
    };
    $http.post('http://localhost:8080/', $scope.getDataToPost()).success(successCallback);
  };

  $scope.getDataToPost = function() {
    return {files: $scope.files};
  };

  $scope.templateFor = function(name) {
    return {
      files:[
        {name:"Runner",value:"clojure_1_6_0"},
        {name:"code.clj",value:"(defn fact [x]\n    (loop [n x f 1]\n        (if (= n 1)\n            f\n            (recur (dec n) (* f n)))))\n\n;cffileid:24"},
        {name:"unittests.clj",value:";[tag:note:gem] I'm positive that this test could be better using some kind of\n;sequence comparison.  Please improve, and also make the code idiomatic as\n;well.\n\n(ns this.test.namespace\n   (:use clojure.test))\n\n(load-file \"./code.clj\")\n\n(deftest test-adder\n  (is (= 1  (fact 1)))\n  (is (= 2  (fact 2)))\n  (is (= 6  (fact 3)))\n)\n\n(run-tests 'this.test.namespace)\n\n;cffileid:25"}
      ]
    }
  }
 
});
