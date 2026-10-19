# similar.ai API Mock

The purpose of this mock is to decouple us from the real similar.ai API endpoints and to be able to setup mocks for automated testing.

## API specification
similar.ai RESTful api specification is defined in OpenAPI version 3 descriptive language in https://jira.corp.ebay.com/browse/GTALL-19805

## Mock behaviour
This mock is data driven. Use the below data table to modify the response behaviour of the mock.
> Please note that mock rules are applied in the same order mentioned in the table.

Request header|keyword|location|category|attributes|Mock behaviour|
|-------------|-------|--------|--------|----------|--------------|
| Missing key: ApiKeyAuth| any | any| any| any|HTTP status code 401|
|Key: ApiKeyAuth, value : any string|any|any|missing key| any|HTTP status code 400 |
|Key: ApiKeyAuth, value : any string| any   | any    | string other than "cars" | any | HTTP status code 500 |
|Key: ApiKeyAuth, value : any string| "get-204"| any | "cars" | any      | HTTP status code 204 |
|Key: ApiKeyAuth, value : any string| any   | any    | "cars" | any      | HTTP status code 200 |

## Development

The mock is written in Typescript as we like languages with a type system which make writting/maintaining code so much easier. From the project root (`~/thirdparty-mocks`) start Typescript compiler in watch mode.
```
tsc -w
```

> This is required to convert `*.ts` file to `.js`,  the compiler configuration can be found in `tsconfig.json`.

## Testing

> Install [mountebank](http://www.mbtest.org/docs/gettingStarted) locally.

To start mock server locally, issue this command
```
> pwd
> ~/thirdparty-mocks
>
> mb --allowInjection --port 1111 --configfile src/imposters.ejs
```

From the table above, choose your request body for the required response behaviour and send request to the local mock server like this:
```
> curl --location --request POST 'http://localhost:7891/api/v1/seo-related-searches-content' \
--header 'ApiKeyAuth: Bearer xlDA7EtOc7oVuvaSMock' \
--header 'Content-Type: application/json' \
--data-raw '{
    "keyword": "",
    "location": "UK",
    "category": "cars",
    "attributes": {
        "vehicle_make": "ford",
        "vehicle_model": "focus"
    }
}'
```
