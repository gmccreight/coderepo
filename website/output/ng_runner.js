window.codeFluentApp = angular.module('CodeFluentApp', []);

window.codeFluentApp.controller("RunnerCtrl", function ($scope, $http) {

  $scope.error = "";
  $scope.files = undefined;
  $scope.currentFile = undefined;
  $scope.isRunning = false;

  $scope.init = function() {
    $scope.files = $scope.templateFor("factorial_clojure").files;
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
    return window.code_templates[name];
  }
 
});
