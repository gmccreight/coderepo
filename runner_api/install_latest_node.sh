#!/usr/bin/env bash

# g++ is a prerequisite for compiling node
sudo apt-get install g++ -y

wget http://nodejs.org/dist/v0.10.28/node-v0.10.28.tar.gz
tar -xvzf node-v*.tar.gz
rm node-v*.tar.gz
cd node-v*
./configure
make
sudo make install
cd ..
rm -r node-v*
