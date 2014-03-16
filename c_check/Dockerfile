FROM ubuntu:latest

# Update the APT cache
RUN sed -i.bak 's/main$/main universe/' /etc/apt/sources.list
RUN apt-get update

RUN apt-get install -y build-essential
RUN apt-get install -y wget

ADD c_check_installer c_check_installer
RUN bash ./c_check_installer

ADD c_check_runner c_check_runner
ADD code code
