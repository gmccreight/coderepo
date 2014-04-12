#!/usr/bin/env bash

vagrant ssh -c "cd /vagrant/api/app; DEBUG=my-application ./bin/www"
