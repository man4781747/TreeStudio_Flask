FROM ubuntu:18.04
MAINTAINER Akira

RUN apt update

RUN apt-get remove python3.6

RUN apt autoremove

RUN apt install python3.7 -y

RUN mv /usr/bin/python3.7 /usr/bin/python

RUN apt install python3-pip -y

RUN python -m pip install --upgrade pip

RUN mkdir flask_server

WORKDIR ./flask_server

ADD requirements.txt .

RUN python -m pip install -r requirements.txt

# RUN pip3 uninstall PyCrypto

RUN python -m pip install -U PyCryptodome


