#!/usr/bin/env bash

echo "note: try surfing to http://localhost:2345/runner/"
vagrant ssh -c "cd /vagrant/website; nanoc view -p 2345"
