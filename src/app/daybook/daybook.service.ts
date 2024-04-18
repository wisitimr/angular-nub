import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { Response } from '../_models/response';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DaybookService {
    constructor(
        private http: HttpClient,
    ) { }

    async getAll(query: any) {
        const res: Response = await lastValueFrom(this.http.get(`${environment.apiUrl}/api/daybook?${new URLSearchParams(query).toString()}`));
        if (res && res.data) {
            return res.data;
        } else {
            return [];
        }
    }

    async getById(id: string) {
        const res: Response = await lastValueFrom(this.http.get(`${environment.apiUrl}/api/daybook/${id}`));
        if (res && res.data) {
            return res.data;
        } else {
            return null;
        }
    }

    async generateExcel(id: string) {
        var res = await lastValueFrom(
            this.http.get(`${environment.apiUrl}/api/report/generate/excel/${id}`, {
                observe: 'response',
                responseType: 'blob',
            })
        ),
            result: any = [res.body];
        const contentDispositionHeader = res.headers.get('Content-Disposition')
        if (contentDispositionHeader) {
            result.push(decodeURIComponent(contentDispositionHeader.split(';')[1].trim().split('=')[1]).replace("utf-8''", ""))
        }
        return result
    }

    async update(id: string, params: any) {
        return await lastValueFrom(this.http.put(`${environment.apiUrl}/daybook/${id}`, params));
    }

    async add(params: any) {
        return await lastValueFrom(this.http.post(`${environment.apiUrl}/daybook`, params));
    }

    async delete(id: string) {
        return await lastValueFrom(this.http.delete(`${environment.apiUrl}/daybook/${id}`))
    }
}