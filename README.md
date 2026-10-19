# Thirdparty mock service
This is set of mock endpoints for thirdparty services we use at Freeside.
Mock endpoints are handled by mountebank (http://www.mbtest.org/)

Each mock is defined in a directory within the src directory of the thirdparty-mocks project,
for example src/version provides a mock web service for the Version API.
Each of those directories has a file imposter.ejs (singular) which defines the requests that the mock handles.
The src directory contains imposters.ejs (plural) defining all the mocks.

It's sometimes necessary to test using a real service rather than a mock.
To avoid having to reconfigure and redeploy your app,
the mock server can be set up to switch between
mocking and proxying to a real service.
For example, if you send request to the `freesidetargeting` mock with `no-mock` added to SRP search keyword real targeting engine will be requested
You get the same result (with a small delay)
that you would have got if you had configured your app to connect directly to
the real service.

This all has to be hand-crafted in the mock source code.

Most of the mocks that use the proxying technique
connect to external servers,
so they need to use the cloud proxy server.
The proxy agent takes care of all that:

     HttpsProxyAgent = require('https-proxy-agent')

It proxies to a local server,
so it can connect directly without going through the cloud proxy.
This is simpler, faster and does not require any firewall changes.


## Running locally

Best way to run thirdpary mocks it to start mountebank inside Docker 


**1. Install dependencies**

```sh
npm install
```

You may need to install typescript.  On a Mac it's:

```sh
sudo npm install -g typescript
```

**2. Compile sources**

Complete the build using Typescript:

```sh
tsc -w
```

Some of the files in the distribution are typescript templates (.ts).
The tsc command finds them and creates the necessary .js files from them.
The command shown above runs until it's stopped.
Leave it for a decent interval, then kill it.


**3. Build the image**

Change into the root of the checkout folder where the DockerFile is located

```sh
docker build -t mb:latest .
```

**4. Start the mock service** 

```sh
docker run --name mb-mocks --rm -it \
-p 2525:2525 -p 1112:1112 -p 3333:3333 -p 8081:8081 -p 5555:5555 -p 7790:7790 -p 7783:7783  -p 7784:7784 -p 7890:7890 -p 7781:7781 -p 7785:7785 -p 8891:8891 -p 8082:8082 \
-v `pwd`/src:/usr/share/freeside/thirdparty-mocks \
-v `pwd`/node_modules:/usr/share/freeside/thirdparty-mocks/node_modules \
-v `pwd`/package.json:/usr/share/freeside/thirdparty-mocks/package.json \
mb:latest
```
Use the docker host ip to hit the mock service:
using older versions of docker use:
```sh
curl http://192.168.99.100:2525
```
Using the newer mac integrated docker (latest release)
```sh
curl http://localhost:2525
```

## Creating a New Service

Check out the the thirdparty_mocks project
and create a feature branch in the usual way.
In the src directory,
create a directory for your mock service,

The file src/imposters.ejs defines the list of mocks.
Add yours to it.

In your directory src/{mock} create a file imposter.ejs (singular).
This defines the requests that the mock accepts, and the responses.
The responses can be defined in a separate file as injected node.js code.

See earlier for instruction for running locally and for building and deploying
to a QA environment.

Once your service is built and deployed to QA, it has two URLs

- internal: http://{imposter}.thirdparty.{fs-environment}.ams1.cloud
- external: https://{imposter}.thirdparty.{environment}.freeside.io


This imposter.ejs file defines a mock web service with one request,
/search/freeside-uk/:

    {
          "port": 8888,
          "protocol": "http",
          "name": "fstargeting",
          "stubs": [
            {
              "predicates": [ {
                  "matches": {
                      "path": "/search/freeside-uk/",
                      "method": "GET"
                   }
              } ],
              "responses": [ {
                  "inject": "<%- stringify(filename, 'fstargeting/search-url.js') %>"
    		  } ]
            }
          ]
    }
 
The path is the URI of the request,
so it does not include any parameters.
 
 
On your local machine, this mock responds on port 8888 to GET requests such as
 
     http://localhost:8888/search/freeside-uk/
     or
     http://localhost:8888/search/freeside-uk/?q=42
 
The response is defined in the node.js file `fstargeting/search-url.js`.
(The file name is relative to the src directory.)
The node.js code assembles the response and returns it.
 
If you create some node.js code and it contains errors,
the error messages you get from Mountebank are not very helpful.
Typically it spews out the entire source code in one long line,
followed by a terse error message,
followed by more irrelevant stuff,
so you see a few thousand characters with maybe three or four words
of useful information buried in the middle.

Various facilities mysteriously fail to work, for example

    request.hostname
    
returns "undefined".  That call is supposed to replace the now-deprecated call 

    request.headers.Host

but that works!

The console.log facility can be useful:

    console.log("url " + request.url);

There is a node.js debugger, if you can figure out how to get it to work in this context.
    
In general, it's best to start with something simple,
test it,
write a little more,
test that,
and so on.


## TODO
- TESTS for the mock endpoints before packaging
