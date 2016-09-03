import { HelloApi } from '../../apis/hello/hello.api';
import { AuthApi } from '../../apis/auth/auth.api';
import { AuthService } from '../auth/auth.service';
import { AuthRepo } from '../auth/auth.repo';

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

    constructor(private _authRepo: AuthRepo) {
        let auth: AuthApi = new AuthApi(new AuthService(), this._authRepo);
        let hello: HelloApi = new HelloApi(this._authRepo);

        this.routes.nonAuth.get['/hello/greet'] = (req, res, next) => hello.sayHi(req, res);
        this.routes.nonAuth.post['/auth/register/email'] = (req, res, next) => auth.registerByEmail(req, res);
        this.routes.nonAuth.post['/auth/signin/email'] = (req, res, next) => auth.signInByEmail(req, res);

        this.routes.auth.get['/hello/greet/me'] = (req, res, next) => hello.sayHiToMe(req, res);
    }

    public registerPublicRoutes(app): void {
        this.registerRouteCollection(app, this.routes.nonAuth);
    }

    public registerAuthenticatedRoutes(app): void {
        this.registerRouteCollection(app, this.routes.auth);
    }

    private registerRouteCollection(app, routeCollection): void {
        for (let verb in routeCollection) {
            for (let h in routeCollection[verb]) {
                app[verb](h, routeCollection[verb][h]);
            }
        }
    }
}
