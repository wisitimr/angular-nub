import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ProductService } from '../product.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    products?: any[];
    loading: boolean = true;
    cols?: any = [
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
        { field: 'price', header: 'Price' },
    ];
    @ViewChild('dt') table: Table;

    constructor(
        private productService: ProductService,
    ) { }

    async ngOnInit() {
        this.products = await this.productService.getAll();
        this.loading = false;
    }

    deleteProduct(id: string) {
        const account = this.products!.find(x => x.id === id);
        account.isDeleting = true;
    }
}