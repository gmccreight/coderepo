FROM ubuntu:latest

# Update the APT cache
RUN sed -i.bak 's/main$/main universe/' /etc/apt/sources.list
RUN apt-get update

RUN apt-get install -y build-essential
RUN apt-get install -y wget
RUN apt-get install -y g++
RUN apt-get install -y unzip

ADD installer installer
RUN bash ./installer

ADD runner runner
