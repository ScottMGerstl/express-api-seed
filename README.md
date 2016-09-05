# express-api-seed

Includes:
* Server Ready-to-run
* Dependency Injection
* Config and Logging Services
* Register and Sign In Endpoints
* Single-location Route Registration
* Custom Exception Handling

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