#!/bin/bash

/usr/local/bin/mb --allowInjection --port 1111 --configfile /usr/share/freeside/thirdparty-mocks/imposters.ejs --logfile /var/log/freeside/thirdparty-mocks/app.log --pidfile /run/thirdparty-mocks/run.pid --protofile /usr/share/freeside/thirdparty-mocks/protocols.json
