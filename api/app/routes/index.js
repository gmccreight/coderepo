var express = require('express');
var router = express.Router();

var sys = require('sys')
var exec = require('child_process').exec;

// /?template=factorial_in_haskell
router.get('/', function(req, res) {

  function puts(error, stdout, stderr) {
    runner_results = {result: stdout}
    res.json(runner_results);
  }

  template = req.query.template || "factorial_clojure";

  exec("./run_a_template " + template, puts);
});

module.exports = router;
