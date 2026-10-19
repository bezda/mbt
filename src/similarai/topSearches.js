function setupTopSearchService(request, state, logger) {
    function main() {
        return new TopSearchService().process();
    }
    class TopSearchService {
        process() {
            const reqBody = request.body || "{}";
            const authenticationError = this.checkAuthentication();
            const mandatoryBodyAttributesError = this.checkMandatoryAttributes(reqBody);
            const nonCarsCategoryError = this.checkNonCarsCategory(reqBody);
            if (authenticationError) {
                return authenticationError;
            }
            if (mandatoryBodyAttributesError) {
                return mandatoryBodyAttributesError;
            }
            if (nonCarsCategoryError) {
                return nonCarsCategoryError;
            }
            return this.prepareResponse(reqBody);
        }
        prepareResponse(reqBody) {
            const keyword = JSON.parse(reqBody).keyword;
            let responseBody = {};
            let statusCode;
            switch (keyword) {
                case 'get-204':
                    statusCode = 204;
                    break;
                default:
                    statusCode = 200;
                    responseBody = this.successResponse();
                    break;
            }
            return {
                statusCode: statusCode,
                headers: { "Content-Type": "application/json" },
                body: responseBody
            };
        }
        checkAuthentication() {
            if (!request.headers['X-API-KEY']) {
                return {
                    statusCode: 401,
                    headers: { "Content-Type": "application/json" },
                    body: {}
                };
            }
            else {
                return null;
            }
        }
        checkNonCarsCategory(reqBody) {
            const topSearchRequestBody = JSON.parse(reqBody);
            const category = topSearchRequestBody.category;
            if (category !== 'cars') {
                return {
                    statusCode: 500,
                    headers: { "Content-Type": "application/json" },
                    body: {
                        "errors": [{
                                "code": 500,
                                "message": "invalid category"
                            }]
                    }
                };
            }
            else {
                return null;
            }
        }
        checkMandatoryAttributes(reqBody) {
            const topSearchRequestBody = JSON.parse(reqBody);
            if (!topSearchRequestBody.category) {
                return {
                    statusCode: 400,
                    headers: { "Content-Type": "application/json" },
                    body: {
                        "errors": [{
                                "code": 400,
                                "message": "invalid request"
                            }]
                    }
                };
            }
        }
        successResponse() {
            return {
                "headerSearches": [
                    {
                        "name": "bmw 1 series",
                        "url": "https://www.gumtree.com/cars/uk/bmw+1+series"
                    },
                    {
                        "name": "spares or repair",
                        "url": "https://www.gumtree.com/cars/uk/spares+or+repair"
                    },
                    {
                        "name": "classic cars",
                        "url": "https://www.gumtree.com/cars/uk/classic+cars"
                    }
                ],
                "footerSearches": [
                    {
                        "name": "ford",
                        "url": "https://www.gumtree.com/cars/uk/ford"
                    },
                    {
                        "name": "ford fiesta",
                        "url": "https://www.gumtree.com/cars/uk/ford/fiesta"
                    },
                    {
                        "name": "ford mondeo",
                        "url": "https://www.gumtree.com/cars/uk/ford/mondeo"
                    }
                ],
                "topLocations": [
                    {
                        "name": "Belfast",
                        "url": "https://www.gumtree.com/cars/belfast"
                    },
                    {
                        "name": "Birmingham",
                        "url": "https://www.gumtree.com/cars/birmingham"
                    },
                    {
                        "name": "Liverpool",
                        "url": "https://www.gumtree.com/cars/liverpool"
                    }
                ]
            };
        }
    }
    return main();
}
