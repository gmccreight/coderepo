window.codeFluentApp = angular.module('CodeFluentApp', []);

window.codeFluentApp.controller("RunnerCtrl", function ($scope, $http) {

  $scope.error = "";

  $scope.getData = function() {return "hello";};

  $scope.hasError = function() {
    return $scope.error != "";
  };

  $scope.setError = function(message) {
    $scope.error = message;
  };

  $scope.runCode = function() {
    $scope.setError("");
    var successCallback = function(data, status, headers, config) {
      if (data.error) {
        $scope.setError(data.error);
      }
    };
    $http.post('http://localhost:8080/', $scope.getFilesToRun()).success(successCallback);
  };

  $scope.getFilesToRun = function() {
    return "";
  };
 
});
