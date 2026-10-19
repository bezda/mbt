function setupTopSearchService(request, state, logger) {

    function main(): object {
        return new TopSearchService().process();
        
    }

    class TopSearchService {


        public process(): object {
            const reqBody: string = request.body || "{}";
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

        private prepareResponse(reqBody: string): object {
            const keyword = JSON.parse(reqBody).keyword;
            let responseBody = {};
            let statusCode;

            switch(keyword) {
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
                headers: {"Content-Type": "application/json"},
                body: responseBody
            };
        }

        private checkAuthentication(): object {
            if (!request.headers['X-API-KEY']) {
                return {
                    statusCode: 401,
                    headers: {"Content-Type": "application/json"},
                    body: {}
                }
            } else {
                return null;
            }
        }

        private checkNonCarsCategory(reqBody: string): object {
            const topSearchRequestBody = JSON.parse(reqBody);
            const category = topSearchRequestBody.category;
            if (category !== 'cars') {
                return {
                    statusCode: 500,
                    headers: {"Content-Type": "application/json"},
                    body: {
                        "errors": [{
                            "code": 500,
                            "message": "invalid category"
                        }]
                    }
                }

            } else {
                return null;
            }

        }

        private checkMandatoryAttributes(reqBody: string): object {
            const topSearchRequestBody = JSON.parse(reqBody);
            if (!topSearchRequestBody.category) {
                return {
                    statusCode: 400,
                    headers: {"Content-Type": "application/json"},
                    body: {
                        "errors": [{
                            "code": 400,
                            "message": "invalid request"
                        }]
                    }
                }    
            }

        }

        private successResponse(): object {
            return {
                  "topLocations": [
                     {
                       "name": "Belfast",
                     },
                     {
                        "name": "Birmingham",
                     },
                     {
                        "name": "Liverpool",
                     }
                   ]
              }
        }

    }

    return main();
}
