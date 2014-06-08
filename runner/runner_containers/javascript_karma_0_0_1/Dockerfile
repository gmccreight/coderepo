FROM ubuntu:latest

# Update the APT cache
RUN apt-get update

RUN apt-get install -y wget

# g++ is a prerequisite for compiling node
RUN apt-get install g++ -y

# make isn't pre-installed on the EC2 version of Ubuntu
RUN apt-get install make -y

ADD installer_node installer_node
RUN bash ./installer_node

ADD installer_karma installer_karma
RUN bash ./installer_karma

ADD karma.conf.js karma.conf.js
ADD runner runner
