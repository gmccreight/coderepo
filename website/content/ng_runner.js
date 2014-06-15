/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  SHA-1 implementation in JavaScript | (c) Chris Veness 2002-2013 | www.movable-type.co.uk      */
/*   - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                             */
/*         http://csrc.nist.gov/groups/ST/toolkit/examples.html                                   */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Sha1 = {};  // Sha1 namespace

/**
 * Generates SHA-1 hash of string
 *
 * @param {String} msg                String to be hashed
 * @param {Boolean} [utf8encode=true] Encode msg as UTF-8 before generating hash
 * @returns {String}                  Hash of msg as hex character string
 */
Sha1.hash = function(msg, utf8encode) {
  utf8encode =  (typeof utf8encode == 'undefined') ? true : utf8encode;
  
  // convert string to UTF-8, as SHA only deals with byte-streams
  if (utf8encode) msg = Utf8.encode(msg);
  
  // constants [§4.2.1]
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  
  // PREPROCESSING 
  
  msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]
  
  // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
  var l = msg.length/4 + 2;  // length (in 32-bit integers) of msg + ‘1’ + appended length
  var N = Math.ceil(l/16);   // number of 16-integer-blocks required to hold 'l' ints
  var M = new Array(N);
  
  for (var i=0; i<N; i++) {
    M[i] = new Array(16);
    for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
      M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) | 
        (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
    } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
  }
  // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
  // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
  // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
  M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14])
  M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;
  
  // set initial hash value [§5.3.1]
  var H0 = 0x67452301;
  var H1 = 0xefcdab89;
  var H2 = 0x98badcfe;
  var H3 = 0x10325476;
  var H4 = 0xc3d2e1f0;
  
  // HASH COMPUTATION [§6.1.2]
  
  var W = new Array(80); var a, b, c, d, e;
  for (var i=0; i<N; i++) {
  
    // 1 - prepare message schedule 'W'
    for (var t=0;  t<16; t++) W[t] = M[i][t];
    for (var t=16; t<80; t++) W[t] = Sha1.ROTL(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1);
    
    // 2 - initialise five working variables a, b, c, d, e with previous hash value
    a = H0; b = H1; c = H2; d = H3; e = H4;
    
    // 3 - main loop
    for (var t=0; t<80; t++) {
      var s = Math.floor(t/20); // seq for blocks of 'f' functions and 'K' constants
      var T = (Sha1.ROTL(a,5) + Sha1.f(s,b,c,d) + e + K[s] + W[t]) & 0xffffffff;
      e = d;
      d = c;
      c = Sha1.ROTL(b, 30);
      b = a;
      a = T;
    }
    
    // 4 - compute the new intermediate hash value
    H0 = (H0+a) & 0xffffffff;  // note 'addition modulo 2^32'
    H1 = (H1+b) & 0xffffffff; 
    H2 = (H2+c) & 0xffffffff; 
    H3 = (H3+d) & 0xffffffff; 
    H4 = (H4+e) & 0xffffffff;
  }

  return Sha1.toHexStr(H0) + Sha1.toHexStr(H1) + 
    Sha1.toHexStr(H2) + Sha1.toHexStr(H3) + Sha1.toHexStr(H4);
}

//
// function 'f' [§4.1.1]
//
Sha1.f = function(s, x, y, z)  {
  switch (s) {
  case 0: return (x & y) ^ (~x & z);           // Ch()
  case 1: return x ^ y ^ z;                    // Parity()
  case 2: return (x & y) ^ (x & z) ^ (y & z);  // Maj()
  case 3: return x ^ y ^ z;                    // Parity()
  }
}

//
// rotate left (circular left shift) value x by n positions [§3.2.5]
//
Sha1.ROTL = function(x, n) {
  return (x<<n) | (x>>>(32-n));
}

//
// hexadecimal representation of a number 
//   (note toString(16) is implementation-dependant, and  
//   in IE returns signed numbers when used on full words)
//
Sha1.toHexStr = function(n) {
  var s="", v;
  for (var i=7; i>=0; i--) { v = (n>>>(i*4)) & 0xf; s += v.toString(16); }
  return s;
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
/*              single-byte character encoding (c) Chris Veness 2002-2013                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Utf8 = {};  // Utf8 namespace

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters 
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @param {String} strUni Unicode string to be encoded as UTF-8
 * @returns {String} encoded string
 */
Utf8.encode = function(strUni) {
  // use regular expressions & String.replace callback function for better efficiency 
  // than procedural approaches
  var strUtf = strUni.replace(
      /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    );
  strUtf = strUtf.replace(
      /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0); 
        return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
  return strUtf;
}

/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @param {String} strUtf UTF-8 string to be decoded back to Unicode
 * @returns {String} decoded string
 */
Utf8.decode = function(strUtf) {
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  var strUni = strUtf.replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f); 
        return String.fromCharCode(cc); }
    );
  strUni = strUni.replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
        return String.fromCharCode(cc); }
    );
  return strUni;
}

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

window.codefluentApp.service('Support', function(){

  this.hashCodeForString = function(string) {
    return Sha1.hash(string);
  };

  this.hexOfLength = function(len) {
    len = len - 1;
    var chars, i, randomstring, rnum, _i;
    chars = "0123456789abcdef";
    randomstring = '';
    for (i = _i = 0; 0 <= len ? _i <= len : _i >= len; i = 0 <= len ? ++_i : --_i) {
      rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  }

});

window.codefluentApp.service('KeyMaker', function(Support){

  this.persistedUniqCodePerPageLoad = undefined; 

  this.getKeyForObject = function(obj) {
    var uniqCodePerPageLoad = this.uniqCodePerPageLoad();
    var hashOfObject = this.hashOfObject(obj);
    return uniqCodePerPageLoad + "_" + hashOfObject;
  };

  this.uniqCodePerPageLoad = function() {
    if (this.persistedUniqCodePerPageLoad) {
      return this.persistedUniqCodePerPageLoad;
    }
    else {
      this.persistedUniqCodePerPageLoad = Support.hexOfLength(10);
      return this.persistedUniqCodePerPageLoad;
    }
  };

  this.hashOfObject = function(obj) {
    var string = JSON.stringify(obj);
    return Support.hashCodeForString(string);
  };

});

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
