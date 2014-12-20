#!/usr/bin/env bash

echo "note: the server is actually accessable at port 8080"
echo "try running the curl_test.sh file: ./runner_api/curl_test.sh"

cd /vagrant/runner_api/app; DEBUG=coderepo-api ./bin/www
