import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { AccountService } from '../account.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    accounts?: any[];
    loading: boolean = true;
    cols?: any = [
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
        { field: 'type', header: 'Type' },
    ];
    @ViewChild('dt') table: Table;

    constructor(
        private accountService: AccountService,
    ) { }

    async ngOnInit() {
        this.accounts = await this.accountService.getAll();
        this.loading = false;
    }

    deleteAccount(id: string) {
        const account = this.accounts!.find(x => x.id === id);
        account.isDeleting = true;
    }
}