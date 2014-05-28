#!/usr/bin/env bash

echo "note: try surfing to http://localhost:2345/runner/"
cd /vagrant/website; nanoc view -p 2345
