var http = require('http');

var sys = require('sys')
var exec = require('child_process').exec;

http.createServer(function (req, res) {
  function puts(error, stdout, stderr) {
    console.log("error " + error);
    console.log("stdout " + stdout);
    console.log("stderr " + stderr);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(stdout + '\n');
  }
  exec("./run_one_from_node factorial_clojure", puts);
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
