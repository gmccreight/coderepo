FROM ubuntu:trusty

# Update the APT cache
RUN sed -i.bak 's/main$/main universe/' /etc/apt/sources.list
RUN apt-get update
RUN apt-get install python -y

ADD runner runner
