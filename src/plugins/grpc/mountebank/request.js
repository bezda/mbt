// handling mountebank requests


const axios = require('axios'),
    log = require('../helpers/logging').logger();


const sendRequest = async (url, data) => {
    log.debug('send request to mountebank');
    log.debug(`url='%s', data='%s'`, url, JSON.stringify(data));
    try {
        const response = await axios.post(url, data);
        log.debug(`response.data="%s"`, JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        /**
         * Changed because mb would crash and not handle any subsequent requests after error happens.
         * Error message would be:
         * ```
         log.error(`error=%s`, JSON.stringify(error));
         ^

         TypeError: Converting circular structure to JSON
         --> starting at object with constructor 'ClientRequest'
         |     property 'socket' -> object with constructor 'Socket'
         --- property '_httpMessage' closes the circle
         at JSON.stringify (<anonymous>)
         at Object.sendRequest ([[PROJECTS-PATH]]thirdparty-mocks/src/plugins/grpc/mountebank/request.js:19:36)
         at processTicksAndRejections (node:internal/process/task_queues:93:5)
         at async [[PROJECTS-PATH]]/thirdparty-mocks/src/plugins/grpc/mock.js:69:32

         error: [grpc:7783] Uh oh! I've crashed! Expect subsequent requests to fail.
        ```
         */
        // log.error(`error=%s`, JSON.stringify(error)); // original code
        log.error(`error.name=%s`, error.name);
        log.error(`error.message=%s`, error.message);
        log.error(`error.stack=%s`, error.stack);
    }
}


module.exports = { sendRequest };
