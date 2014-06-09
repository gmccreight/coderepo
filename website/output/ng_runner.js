/**
 * Binds a ACE Editor widget
 */
angular.module('ui.ace', [])
  .constant('uiAceConfig', {})
  .directive('uiAce', ['uiAceConfig', function (uiAceConfig) {

    if (angular.isUndefined(window.ace)) {
      throw new Error('ui-ace need ace to work... (o rly?)');
    }

    /**
     * Sets editor options such as the wrapping mode or the syntax checker.
     *
     * The supported options are:
     *
     *   <ul>
     *     <li>showGutter</li>
     *     <li>useWrapMode</li>
     *     <li>onLoad</li>
     *     <li>theme</li>
     *     <li>mode</li>
     *   </ul>
     *
     * @param acee
     * @param session ACE editor session
     * @param {object} opts Options to be set
     */
    var setOptions = function(acee, session, opts) {

      // Boolean options
      if (angular.isDefined(opts.showGutter)) {
        acee.renderer.setShowGutter(opts.showGutter);
      }
      if (angular.isDefined(opts.useWrapMode)) {
        session.setUseWrapMode(opts.useWrapMode);
      }
      if (angular.isDefined(opts.showInvisibles)) {
        acee.renderer.setShowInvisibles(opts.showInvisibles);
      }
      if (angular.isDefined(opts.showIndentGuides)) {
        acee.renderer.setDisplayIndentGuides(opts.showIndentGuides);
      }
      if (angular.isDefined(opts.useSoftTabs)) {
        session.setUseSoftTabs(opts.useSoftTabs);
      }

      // commands
      if (angular.isDefined(opts.disableSearch) && opts.disableSearch) {
        acee.commands.addCommands([
          {
            name: 'unfind',
            bindKey: {
              win: 'Ctrl-F',
              mac: 'Command-F'
            },
            exec: function () {
              return false;
            },
            readOnly: true
          }
        ]);
      }

      // onLoad callback
      if (angular.isFunction(opts.onLoad)) {
        opts.onLoad(acee);
      }

      // Basic options
      if (angular.isString(opts.theme)) {
        acee.setTheme('ace/theme/' + opts.theme);
      }
      if (angular.isString(opts.mode)) {
        session.setMode('ace/mode/' + opts.mode);
      }
    };

    return {
      restrict: 'EA',
      require: '?ngModel',
      link: function (scope, elm, attrs, ngModel) {

        /**
         * Corresponds the uiAceConfig ACE configuration.
         * @type object
         */
        var options = uiAceConfig.ace || {};

        /**
         * uiAceConfig merged with user options via json in attribute or data binding
         * @type object
         */
        var opts = angular.extend({}, options, scope.$eval(attrs.uiAce));

        /**
         * ACE editor
         * @type object
         */
        var acee = window.ace.edit(elm[0]);

        /**
         * ACE editor session.
         * @type object
         * @see [EditSession]{@link http://ace.c9.io/#nav=api&api=edit_session}
         */
        var session = acee.getSession();

        /**
         * Reference to a change listener created by the listener factory.
         * @function
         * @see listenerFactory.onChange
         */
        var onChangeListener;

        /**
         * Reference to a blur listener created by the listener factory.
         * @function
         * @see listenerFactory.onBlur
         */
        var onBlurListener;

        /**
         * Calls a callback by checking its existing. The argument list
         * is variable and thus this function is relying on the arguments
         * object.
         * @throws {Error} If the callback isn't a function
         */
        var executeUserCallback = function () {

          /**
           * The callback function grabbed from the array-like arguments
           * object. The first argument should always be the callback.
           *
           * @see [arguments]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments}
           * @type {*}
           */
          var callback = arguments[0];

          /**
           * Arguments to be passed to the callback. These are taken
           * from the array-like arguments object. The first argument
           * is stripped because that should be the callback function.
           *
           * @see [arguments]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments}
           * @type {Array}
           */
          var args = Array.prototype.slice.call(arguments, 1);

          if (angular.isDefined(callback)) {
            scope.$apply(function () {
              if (angular.isFunction(callback)) {
                callback(args);
              } else {
                throw new Error('ui-ace use a function as callback.');
              }
            });
          }
        };

        /**
         * Listener factory. Until now only change listeners can be created.
         * @type object
         */
        var listenerFactory = {
          /**
           * Creates a change listener which propagates the change event
           * and the editor session to the callback from the user option
           * onChange. It might be exchanged during runtime, if this
           * happens the old listener will be unbound.
           *
           * @param callback callback function defined in the user options
           * @see onChangeListener
           */
          onChange: function (callback) {
            return function (e) {
              var newValue = session.getValue();
              if (newValue !== scope.$eval(attrs.value) && !scope.$$phase && !scope.$root.$$phase) {
                if (angular.isDefined(ngModel)) {
                  scope.$apply(function () {
                    ngModel.$setViewValue(newValue);
                  });
                }
                executeUserCallback(callback, e, acee);
              }
            };
          },
          /**
           * Creates a blur listener which propagates the editor session
           * to the callback from the user option onBlur. It might be
           * exchanged during runtime, if this happens the old listener
           * will be unbound.
           *
           * @param callback callback function defined in the user options
           * @see onBlurListener
           */
          onBlur: function (callback) {
            return function () {
              executeUserCallback(callback, acee);
            };
          }
        };

        attrs.$observe('readonly', function (value) {
          acee.setReadOnly(value === 'true');
        });

        // Value Blind
        if (angular.isDefined(ngModel)) {
          ngModel.$formatters.push(function (value) {
            if (angular.isUndefined(value) || value === null) {
              return '';
            }
            else if (angular.isObject(value) || angular.isArray(value)) {
              throw new Error('ui-ace cannot use an object or an array as a model');
            }
            return value;
          });

          ngModel.$render = function () {
            session.setValue(ngModel.$viewValue);
          };
        }

        // set the options here, even if we try to watch later, if this
        // line is missing things go wrong (and the tests will also fail)
        setOptions(acee, session, opts);

        // Listen for option updates
        scope.$watch( attrs.uiAce, function() {
          opts = angular.extend({}, options, scope.$eval(attrs.uiAce));

          // unbind old change listener
          session.removeListener('change', onChangeListener);

          // bind new change listener
          onChangeListener = listenerFactory.onChange(opts.onChange);
          session.on('change', onChangeListener);

          // unbind old blur listener
          //session.removeListener('blur', onBlurListener);
          acee.removeListener('blur', onBlurListener);

          // bind new blur listener
          onBlurListener = listenerFactory.onBlur(opts.onBlur);
          acee.on('blur', onBlurListener);

          setOptions(acee, session, opts);
        }, /* deep watch */ true );

        // EVENTS
        onChangeListener = listenerFactory.onChange(opts.onChange);
        session.on('change', onChangeListener);

        onBlurListener = listenerFactory.onBlur(opts.onBlur);
        acee.on('blur', onBlurListener);

        elm.on('$destroy', function () {
          acee.session.$stopWorker();
          acee.destroy();
        });

        scope.$watch(function() {
          return [elm[0].offsetWidth, elm[0].offsetHeight];
        }, function() {
          acee.resize();
          acee.renderer.updateFull();
        }, true);

      }
    };
  }]);

window.codefluentApp = angular.module('CodefluentApp', ['ui.ace']);

window.codefluentApp.service('BrowserInfo', function(){

  this.windowLocationSearch = function() {
    return window.location.search;
  };

  this.windowLocationHostname = function() {
    return window.location.hostname;
  };

});

window.codefluentApp.service('RunnerWebService', function($http, BrowserInfo){

  this.getUrl = function() {
    if ( BrowserInfo.windowLocationHostname().match(/codefluent/) ) {
      return 'http://runner.codefluent.us/';
    }
    else {
      return 'http://localhost:8080/';
    }
  };

  this.run = function(data, normalCompletionCallback, serverErrorCallback) {

    var runWasCompletedCallback = function(data, status, headers, config) {
      if (data.error) {
        serverErrorCallback(data.error);
      }
      else {
        normalCompletionCallback(data.did_pass, data.stdout, data.stderr);
      }
    };

    $http.post(this.getUrl(), data).success(runWasCompletedCallback);
  };

});

window.codefluentApp.service('CodeFilesService', function(BrowserInfo){

  this.initialTemplate = function() {
    var matches = BrowserInfo.windowLocationSearch().match(/^[?]t=([a-z_]+)$/);
    if (matches) {
      return matches[1];
    }
    else {
      return "kmp_in_python";
    }
  };

});

window.codefluentApp.controller("RunnerCtrl", function ($scope, CodeFilesService, RunnerWebService) {

  $scope.error = "";
  $scope.files = undefined;
  $scope.currentFile = undefined;
  $scope.isRunning = false;
  $scope.currentTemplate = null;
  $scope.runnerName = "";

  $scope.init = function() {
    $scope.currentTemplate = CodeFilesService.initialTemplate();
    $scope.templateSelected();
  };

  $scope.typeForFile = function(fileName) {

    if (fileName === "Makefile") {
      return "makefile";
    }

    // [tag:hack:gem] This doesn't seem like a great way of getting the
    // filetype.  Too much work.

    var typeFor = {
      c:"c_cpp",
      cc:"c_cpp",
      clj:"clojure",
      coffee:"coffee",
      go:"golang",
      h:"c_cpp",
      hs:"haskell",
      js:"javascript",
      py:"python",
      rb:"ruby",
      rs:"rust",
    }

    var keys = Object.keys(typeFor);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if ( fileName.indexOf("." + key) != -1 ) {
        return typeFor[key];
      }
    }
  };

  $scope.editableFiles = function() {
    var results = [];
    for (var i = 0; i < $scope.files.length; i++) { 
      var file = $scope.files[i];
      if (file.name == "Runner") {
        $scope.runnerName = file.value;
      }
      else {
        results.push(file);
      }
    }
    return results;
  };

  $scope.resetOutput = function() {
    $scope.error = "";
    $scope.setDidPass(false);
    $scope.setIsRunning(false);
  };

  $scope.templateSelected = function() {
    $scope.resetOutput();
    $scope.files = $scope.templateFor($scope.currentTemplate).files;
    $scope.currentFile = $scope.files[0].name;
  };

  $scope.hasError = function() {
    return $scope.error != "";
  };

  $scope.setError = function(message) {
    $scope.error = message;
  };

  $scope.showHowWasRun = function() {
    if ($scope.didPass) {
      return true;
    }
    return false;
  }

  $scope.howWasRunUrl = function() {
    return "https://github.com/gmccreight/codefluent/tree/master/runner/runner_containers/" + $scope.runnerName;
  }

  $scope.setDidPass = function(didPass) {
    $scope.didPass = didPass;
  };

  $scope.setIsRunning = function(isRunning) {
    $scope.isRunning = isRunning;
  };

  $scope.runCode = function() {
    $scope.resetOutput();
    $scope.setIsRunning(true);

    RunnerWebService.run($scope.getDataToPost(), this.onRunnerWebServiceCompletedNormally, this.onRunnerWebServiceCompletedWithServerError);
  };

  $scope.getDataToPost = function() {
    return {files: $scope.files};
  };

  $scope.codeTemplateNames = function() {
    return Object.keys(window.code_templates);
  }

  $scope.templateFor = function(name) {
    return window.code_templates[name];
  }

  //--------------------------------------------------------------------------
  //--------------------------------------------------------------------------
  // Service callbacks
  //--------------------------------------------------------------------------
  //--------------------------------------------------------------------------

  $scope.onRunnerWebServiceCompletedWithServerError = function(error) {
    $scope.setIsRunning(false);
    $scope.setError(error);
  };

  $scope.onRunnerWebServiceCompletedNormally = function(didPass, stdout, stderr) {
    $scope.setIsRunning(false);
    if (didPass) {
      $scope.setDidPass(true);
    }
    else {
      $scope.setError(stdout + stderr);
    }
  };
 
});
