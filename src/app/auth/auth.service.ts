import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { Response } from '../_models/response';

@Injectable({ providedIn: 'root' })
export class AuthService {
    public userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    async login(username: string, password: string) {
        return await lastValueFrom(this.http.post<any>(`${environment.apiUrl}/api/auth/login`, { username, password }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    clear() {
        localStorage.removeItem('user');
        this.userSubject.next(null);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/user/register`, user);
    }
}