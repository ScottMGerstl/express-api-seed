# express-api-seed

Includes:
* Server Ready-to-run
* Dependency Injection via [typedi](https://github.com/pleerock/typedi)
* Authentication
    * bcrypt
    * jwt
    * Register and Sign In Endpoints
* Config and Logging Services
* Exception & Error Handling Framework
* Single-location Route Registration

## Extending the api

### Example files:

* `/hello/hello.api.ts`
* `/server/route-registry.ts`

### There are 2 main parts to extending your api:

**1.** create your class and/or function that will accept the http request. The method definition must accept express request and response objects.

``` javascript
    import { BaseApi } from '../path/to/base.api';
    import * as Express from 'express';
    import { Service } from 'typedi';

    @Service()
    export class SomeApi extends BaseApi {

        constructor(private _someClassThatDoesSomething: SomeClassIWantToInject) {
            super();
        }

        public doSomething(req: Express.Request, res: Express.Response): void {
            let successMessage: string = this._someClassThatDoesSomething.doTheThing();

            res.status(200).send({message: successMessage});
        }

        public doSomethingForAccount(req: Express.Request, res: Express.Response): void {

            try {
                // The accountId is placed on the request body by the auth handler, registered in the express server. Don't pass accountId directly
                let accountId: string = req.body.accountId;

                let successMessage: string = this._someClassThatDoesSomething.doTheThingForTheAccount(accountId);

                res.status(200).send({message: successMessage});
            }
            catch (err) {
                // In BaseApi
                this.sendErrorResponse(err, res);
            }
        }
    }
```

**Note:** Using `@Service()` on the class allows for your class to have injected classes using `typedi`. [Full Documentation on typedi](https://github.com/pleerock/typedi).
If you use constructor injection in the api/controller classes and you register the apis in the route-registery as documented below, the dependency injection is taken care of for you.

---

**2.** Register your new controller and/or function with the `/server/route-registery.ts` file. If it should be an authenticated endpoint, add it to the **auth** object, otherwise, add it to the **nonAuth** object

``` javascript
    import {SomeApi} from '../path/to/api.ts'
    ...

    constructor(private _someApi: SomeApi) {}

    this.routes.nonAuth.post['/do/something'] = (req, res, next) => this._someApi.doSomething(req, res);
    this.routes.auth.post['/do/something/for/me'] = (req, res, next) => this._someApi.doSomethingForAccount(req, res);
```

* Defining the api/controller as an argument in the constructor, automatically creates an instance using dependency injection
* The registration pattern: so the api/controller classes do not need to be static.


## Making the http request

When supplying information in the request body, the Content-Type header is required

```
Content-Type: application/json
```

## Building and Running the API

### Building

```
npm run build
```

### Running

```
npm start
```

You will need to rebuild and restart the api after making changes. To make this quicker:

### Rebuilding and ReRunning

```
Ctrl + c, Ctrl + c
npm run retry
```

This will stop the API process, run the quick-build command (only what is necessary to rebuild the files) and start the server again

## Config Service

The config service and supporting classes are in [`src/framework/config`](https://github.com/ScottMGerstl/express-api-seed/tree/master/src/framework/config).

This folder contains:
* `config.service.ts`: the instantiable class that should be used to get configs
* `config-store.ts`: the variable that holds all config values
* `config.interface.ts`: the file that holds all the interfaces defining the configs

**Make sure** to set [your own values](https://github.com/ScottMGerstl/express-api-seed/blob/master/src/framework/config/config-store.ts).

## Auth

Authentication is configured in the [`src/framework/auth/jwt.service.ts`](https://github.com/ScottMGerstl/express-api-seed/blob/master/src/framework/auth/jwt.service.ts) file. There is a basic JWT implemented here; it currently contains the following public claims:

* iss
* iat
* exp
* sub

It encrypts based on sha512 and uses the ConfigService to retrieve settings for:

* the secret key
* the number of days the token is valid
* the issuer (iss) of your token

If you would like to implement your own scheme you may adjust this file.

## Logging Service

The logging service is in [`src/framework/logging`](https://github.com/ScottMGerstl/express-api-seed/tree/master/src/framework/logging) There is a basic, non-blocking implementation that logs to the console.

If you would like to log to a 3rd party, add the functionality in the `logging.service.ts` file. The service makes use of the ConfigService and imports the error tracking configs. Modify the IErrorTrackingConfig interface and ConfigStore in the config folder as needed.

## Exception & Error Handling Framework

There is a set of custom API exceptions in the [`src/framework/exceptions/exceptions.ts`](https://github.com/ScottMGerstl/express-api-seed/blob/master/src/framework/exceptions/exceptions.ts) file. These include:

* Unauthorized Exception
* Forbidden Exception
* NotFound Exception
* Conflict Exception
* Validation Exception

These custom exceptions make use of BaseApiException. Everything extending from BaseApiException is explicitly handled by the ResponseUtils which is implemented by the BaseApi abstract class. This allows you to throw a handled exception all the way out to the api/controller, and it will take care of creating the error response. If an error that does not extend from BaseApiException is recieved, it will assume it was unhandled, assign a 500 to the response and log the error using the LoggingService.

