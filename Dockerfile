FROM alpine:3.8

EXPOSE 2525
ENTRYPOINT ["/docker.sh"]
ENV MOUNTEBANK_VERSION=2.3.3

RUN apk add --update nodejs
RUN apk add --update npm
RUN npm install -g mountebank@${MOUNTEBANK_VERSION} --production

# create soft link to match path to `node` with one on QA
# this is to enable protocals like `gRPC` defined in src/protocols.json
RUN mkdir -p /usr/local/mountebank-v2.3.3-linux-x64/node-v12.9.1-linux-x64/bin
RUN ln -s /usr/bin/node /usr/local/mountebank-v2.3.3-linux-x64/node-v12.9.1-linux-x64/bin/node

COPY docker.sh .
RUN chmod +x docker.sh
