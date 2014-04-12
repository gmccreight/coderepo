#!/usr/bin/env bash

vagrant ssh -c "cd /vagrant/api/app; DEBUG=codefluent-api ./bin/www"
