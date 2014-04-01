FROM ubuntu:latest

# Update the APT cache
RUN sed -i.bak 's/main$/main universe/' /etc/apt/sources.list
RUN apt-get update

RUN apt-get install -y wget

ADD golang_installer golang_installer
RUN bash ./golang_installer

ADD golang_runner golang_runner
