#!/usr/bin/env bash

sudo gem install nanoc
sudo gem install adsf

sudo apt-get install ruby-dev -y
sudo gem install fog

# karma
sudo apt-get install phantomjs -y
sudo npm install karma -g
sudo npm install karma-jasmine -g
sudo npm install karma-phantomjs-launcher -g
