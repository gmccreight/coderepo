#!/usr/bin/env bash

echo "note: the server is actually accessable at port 8080"
echo "try running the curl_test.sh file: ./runner_api/curl_test.sh"
vagrant ssh -c "cd /vagrant/runner_api/app; DEBUG=codefluent-api ./bin/www"
