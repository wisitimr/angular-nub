import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Response } from '../../_models/response';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DaybookDetailService {
    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) { }

    async getAll() {
        const res: Response = await lastValueFrom(this.http.get(`${environment.url}/api/daybook/detail?company=${this.authService.userValue.company && this.authService.userValue.company.id}`));
        if (res && res.data) {
            return res.data;
        } else {
            return [];
        }
    }

    async getById(id: string) {
        const res: Response = await lastValueFrom(this.http.get(`${environment.url}/api/daybook/detail/${id}`));
        if (res && res.data) {
            return res.data;
        } else {
            return null;
        }
    }

    async update(id: string, params: any) {
        return await lastValueFrom(this.http.put(`${environment.url}/daybook/detail/${id}`, params));
    }

    async add(params: any) {
        return await lastValueFrom(this.http.post(`${environment.url}/daybook/detail`, params));
    }

    async delete(id: string) {
        return await lastValueFrom(this.http.delete(`${environment.url}/daybook/detail/${id}`))
    }
}