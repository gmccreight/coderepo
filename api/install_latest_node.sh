#!/usr/bin/env bash

wget http://nodejs.org/dist/v0.10.26/node-v0.10.26.tar.gz
tar -xvzf node-v*.tar.gz
rm node-v*.tar.gz
cd node-v*
./configure
make
sudo make install
cd ..
rm -r node-v*
