import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { SupplierService } from '../supplier.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    suppliers?: any[];
    loading: boolean = true;
    cols?: any = [
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
    ];
    @ViewChild('dt') table: Table;

    constructor(
        private supplierService: SupplierService,
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        this.suppliers = await this.supplierService.getAll();
        this.loading = false;
    }

    deleteSupplier(id: string) {
        const account = this.suppliers!.find(x => x.id === id);
        account.isDeleting = true;
    }
}