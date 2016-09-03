import * as Promise from 'es6-promise';
import { NotFoundException } from '../../framework/exceptions/exceptions';

export class AuthRepo {
    private repo: any[] = [];

    public createAccount(account): Promise.Promise<number> {
        return new Promise.Promise<number>((resolve, reject) => {
            this.repo.push(account);
            account.accountId = this.repo.length;

            resolve(account.accountId);
        });
    }

    public getAccountByEmail(email: string): Promise.Promise<any> {
        return new Promise.Promise<number>((resolve, reject) => {
            for (let r of this.repo) {
                if (r.email === email) {
                    resolve(r);
                }
            }

            reject(new NotFoundException(null));
        });
    }

    public getAccountById(accountId: number): Promise.Promise<any> {
        return new Promise.Promise<number>((resolve, reject) => {
            for (let r of this.repo) {
                if (r.accountId === accountId) {
                    resolve(r);
                }
            };

            reject(new NotFoundException(null));
        });
    }
}