#!/usr/bin/env bash

cd runner_api/app

sudo DEBUG=codefluent-api PORT=80 ./bin/www
