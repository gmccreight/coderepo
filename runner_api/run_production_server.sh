#!/usr/bin/env bash

cd runner_api/app

sudo DEBUG=coderepo-api PORT=80 ./bin/www
