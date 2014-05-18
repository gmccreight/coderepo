#!/usr/bin/env bash

(
cd runner_api
curl -X POST -H "Content-Type: application/json" --data-binary @factorial_clojure_post_body.json http://localhost:8080/
)
