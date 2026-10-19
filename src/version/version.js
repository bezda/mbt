function version (request) {
    var pjson = require('/usr/share/freeside/thirdparty-mocks/package.json');
    logger.info("pjson ", pjson)
    // Return the mock response
    return {
        headers: {"Content-Type": "application/json"},
        statusCode: 200,
        body: {"metadata": {"version": pjson.version}}
    };
}
