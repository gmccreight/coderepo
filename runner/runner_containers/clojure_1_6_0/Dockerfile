FROM ubuntu:latest

# Update the APT cache
RUN sed -i.bak 's/main$/main universe/' /etc/apt/sources.list
RUN apt-get update

RUN apt-get install -y wget

ADD installer installer
RUN bash ./installer

ADD clojure-1.6.0.jar clojure-1.6.0.jar

ADD runner runner
