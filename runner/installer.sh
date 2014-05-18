#!/usr/bin/env bash

sudo apt-get install docker.io -y
sudo ln -s /usr/bin/docker.io /usr/bin/docker
sudo docker pull ubuntu
