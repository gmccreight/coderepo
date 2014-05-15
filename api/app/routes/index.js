var express = require('express');
var router = express.Router();

var sys = require('sys')
var exec = require('child_process').exec;
var fs = require('fs');
var tmp = require('tmp');

// the curl_test.sh file excercises this method

router.post('/', function(req, res) {

  var tempDirPath = null;

  var numFilesWritten = 0;

  var files = req.body.files;

  if (! files) {
    res.json({error: "no files were passed to the API"});
    return;
  }

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
