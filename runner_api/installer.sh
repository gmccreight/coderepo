#!/usr/bin/env bash

sudo apt-get update

./install_latest_node.sh
./install_express.sh

(
  cd app
  sudo npm install -g
)
