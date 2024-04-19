import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { AccountService } from '../account.service';
import { NotyService } from 'src/app/_services/noty.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    accounts?: any[];
    loading: boolean = false;
    cols?: any = [
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
        { field: 'type.name', header: 'Type' },
    ];
    @ViewChild('dt') table: Table;

    constructor(
        private accountService: AccountService,
        private noty: NotyService
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        this.search();
    }

    async search() {
        this.loading = true;
        try {
            this.accounts = await this.accountService.getAll();
        } catch (error) {
            this.noty.error(error)
        } finally {
            this.loading = false;
        }
    }

    async deleteAccount(id: string) {
        const account = this.accounts!.find(x => x.id === id);
        try {
            if (await this.noty.confirm()) {
                account.isDeleting = true;
                const res = await this.accountService.delete(id);

                this.noty.success(res["statusMessage"]);
                this.search();
            }
        } catch (error) {
            this.noty.error(error)
        } finally {
            account.isDeleting = false;
        }
    }

    getValue(data, field) {
        const fields = field.split('.');
        if (fields.length > 1) {
            var r = data
            for (const f of fields) {
                r = r[f]
            }
            return r
        } else {
            return data[field]
        }
    }
}