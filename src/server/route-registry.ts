import { HelloApi } from '../hello/hello.api';

export class RouteRegistry {
    private routes = {
        nonAuth: {
            get: {},
            post: {},
            delete: {}
        },
        auth: {
            get: {},
            post: {},
            put: {},
            delete: {}
        }
    };

    constructor() {
        this.routes.nonAuth.get['/hello/greet'] = HelloApi.sayHi;
        this.routes.nonAuth.post['/hello/greet/me'] = HelloApi.sayHiToMe;
    }

    public registerPublicRoutes(app) {
        this.registerRouteCollection(app, this.routes.nonAuth);
    }

    public registerAuthenticatedRoutes(app) {
        this.registerRouteCollection(app, this.routes.auth);
    }

    private registerRouteCollection(app, routeCollection) {
        for (let verb in routeCollection) {
            for (let h in routeCollection[verb]) {
                app[verb](h, routeCollection[verb][h]);
            }
        }
    }
}
