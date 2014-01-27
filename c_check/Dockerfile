FROM ubuntu:latest

# Update the APT cache
RUN sed -i.bak 's/main$/main universe/' /etc/apt/sources.list
RUN apt-get update
RUN apt-get upgrade -y

RUN apt-get install -y build-essential
RUN apt-get install -y texinfo
RUN apt-get install -y wget
RUN apt-get install -y tar

ADD shared shared

RUN bash shared/c_check_installer
RUN bash shared/c_check_runner
