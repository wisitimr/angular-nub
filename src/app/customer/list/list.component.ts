import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { CustomerService } from '../customer.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    customers?: any[];
    loading: boolean = true;
    cols?: any = [
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
    ];
    @ViewChild('dt') table: Table;

    constructor(
        private customerService: CustomerService,
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        this.customers = await this.customerService.getAll();
        this.loading = false;
    }

    deleteCustomer(id: string) {
        const account = this.customers!.find(x => x.id === id);
        account.isDeleting = true;
    }
}