# express-api-seed

## Extending the api

### Example files:

* /hello/hello.api.ts
* /server/route-registry.ts

### There are 2 main parts to extending your api:

1. create your class and/or function that will accept the http request. The **function must be static** The method definition must accept a request and a response object.

``` javascript
import { BaseApi } from '../path/to/base.api';
import * as Express from 'express';

export class SomeApi extends BaseApi {
    public static doSomething(req: Express.Request, res: Express.Response): void {
        res.status(200).send({message: 'did it!'});
    }
}
```

1. Register your new controller and/or function with the `/server/route-registery.ts` file. If it should be an authenticated endpoint, add it to the **auth** object, otherwise, add it to the **nonAuth** object

``` javascript
import {SomeApi} from '../path/to/api.ts'
...
this.routes.<nonAuth|auth>.get['/do/something'] = SomeApi.doSomething;
```

## Making the http request

When supplying information in the request body, the Content-Type header is required


```
Content-Type: application/json
```

