#!/usr/bin/env bash

./install_latest_node.sh
./install_express.sh

(
  cd app
  sudo npm install -g
)
