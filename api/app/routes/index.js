var express = require('express');
var router = express.Router();

var sys = require('sys')
var exec = require('child_process').exec;
var fs = require('fs');
var tmp = require('tmp');

// /?template=factorial_in_haskell
router.get('/', function(req, res) {

  function puts(error, stdout, stderr) {
    var did_pass = !! stdout.match(/CF_OK/);
    var runner_results = {stdout: stdout, did_pass: did_pass};
    res.json(runner_results);
  }

  template = req.query.template || "factorial_clojure";

  exec("./run_a_template " + template, puts);
});

// curl -X POST -H "Content-Type: application/json" -d '{"files":[{"name":"code.h","value":"this would be header code"}, {"name":"code.c","value":"this would be body code"}]}' http://localhost:8080/

router.post('/', function(req, res) {

  var tempDirPath = null;

  var numFilesWritten = 0;

  var files = req.body.files;

  function afterRun(error, stdout, stderr) {
    var did_pass = !! stdout.match(/CF_OK/);
    var runner_results = {stdout: stdout, did_pass: did_pass, stderr: stderr};
    res.json(runner_results);
  }

  var aFileProcessingWasCompleted = function() {
    if (numFilesWritten === files.length) {
      exec("./run_a_directory " + tempDirPath, afterRun);
    }
  };

  tmp.dir(function _tempDirCreated(err, path) {

    tempDirPath = path;

    files.forEach(function(file) {

      var newPath = tempDirPath + "/" + file.name;
      var data = file.value;

      fs.writeFile(newPath, data, function (err) {
        numFilesWritten = numFilesWritten + 1;
        aFileProcessingWasCompleted();
      });

    });

  });

});

module.exports = router;
