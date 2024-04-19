import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Response } from '../_models/response';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    async getAll() {
        const res: Response = await lastValueFrom(this.http.get(`${environment.url}/user`));
        if (res && res.data) {
            return res.data;
        } else {
            return [];
        }
    }

    async getById(id: string) {
        const res: Response = await lastValueFrom(this.http.get(`${environment.url}/user/${id}`));
        if (res && res.data) {
            return res.data;
        } else {
            return null;
        }
    }

    update(id: string, params: any) {
        return this.http.put(`${environment.url}/user/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.authService.userValue?.id) {
                    // update local storage
                    const user = { ...this.authService.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.authService.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.url}/user/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.authService.userValue?.id) {
                    this.authService.logout();
                }
                return x;
            }));
    }
}