import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Response } from '../_models/response';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AccountService {
    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) { }

    async getAll() {
        const res: Response = await lastValueFrom(this.http.get(`${environment.url}/account?company=${this.authService.userValue.company && this.authService.userValue.company.id}`));
        if (res && res.data) {
            return res.data;
        } else {
            return [];
        }
    }

    async getById(id: string) {
        const res: Response = await lastValueFrom(this.http.get(`${environment.url}/account/${id}`));
        if (res && res.data) {
            return res.data;
        } else {
            return null;
        }
    }

    async update(id: string, params: any) {
        return await lastValueFrom(this.http.put(`${environment.url}/account/${id}`, params));
    }

    async add(params: any) {
        return await lastValueFrom(this.http.post(`${environment.url}/account`, params));
    }

    async delete(id: string) {
        return await lastValueFrom(this.http.delete(`${environment.url}/account/${id}`))
    }

    async getAccountType() {
        const res: Response = await lastValueFrom(this.http.get(`${environment.url}/accountType`));
        if (res && res.data) {
            return res.data;
        } else {
            return [];
        }
    }
}