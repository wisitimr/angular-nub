import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Response } from '../_models/response';

@Injectable({ providedIn: 'root' })
export class MsService {
    constructor(
        private http: HttpClient,
    ) { }

    async getPaymentMethod() {
        const res: Response = await lastValueFrom(this.http.get(`${environment.url}/payment/method`));
        if (res && res.data) {
            return res.data;
        } else {
            return [];
        }
    }

    async getDocument() {
        const res: Response = await lastValueFrom(this.http.get(`${environment.url}/document`));
        if (res && res.data) {
            return res.data;
        } else {
            return [];
        }
    }

    async getSupplier() {
        const res: Response = await lastValueFrom(this.http.get(`${environment.url}/supplier`));
        if (res && res.data) {
            return res.data;
        } else {
            return [];
        }
    }

    async getCustomer() {
        const res: Response = await lastValueFrom(this.http.get(`${environment.url}/customer`));
        if (res && res.data) {
            return res.data;
        } else {
            return [];
        }
    }
}