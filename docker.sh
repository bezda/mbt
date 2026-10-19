#!/bin/sh

mb \
--configfile /usr/share/freeside/thirdparty-mocks/imposters.ejs  \
--protofile /usr/share/freeside/thirdparty-mocks/protocols.json \
--allowInjection
