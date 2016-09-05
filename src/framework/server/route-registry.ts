import { Service } from 'typedi';
import * as Express from 'express';

import { AuthApi } from '../../apis/auth/auth.api';
import { HelloApi } from '../../apis/hello/hello.api';

@Service()
export class RouteRegistry {
    private routes = {
        nonAuth: {
            get: {},
            post: {},
            put: {},
            delete: {}
        },
        auth: {
            get: {},
            post: {},
            put: {},
            delete: {}
        }
    };

    constructor(private auth: AuthApi, private hello: HelloApi) {

        // auth
        this.routes.nonAuth.post['/auth/register/email'] = (req, res, next) => auth.registerByEmail(req, res);
        this.routes.nonAuth.post['/auth/signin/email'] = (req, res, next) => auth.signInByEmail(req, res);

        // hello
        this.routes.nonAuth.get['/hello/greet'] = (req, res, next) => hello.sayHi(req, res);
        this.routes.auth.get['/hello/greet/me'] = (req, res, next) => hello.sayHiToMe(req, res);
    }

    public registerPublicRoutes(app: Express.Express): void {
        this.registerRouteCollection(app, this.routes.nonAuth);
    }

    public registerAuthenticatedRoutes(app: Express.Express): void {
        this.registerRouteCollection(app, this.routes.auth);
    }

    private registerRouteCollection(app: Express.Express, routeCollection: any): void {
        for (let verb in routeCollection) {
            for (let h in routeCollection[verb]) {
                app[verb](h, routeCollection[verb][h]);
            }
        }
    }
}
