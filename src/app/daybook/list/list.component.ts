import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { DaybookService } from '../daybook.service';
import * as moment from 'moment';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    daybooks?: any[];
    loading: boolean = true;
    cols?: any = [
        { field: 'number', header: 'Number' },
        { field: 'invoice', header: 'Invoice' },
        { field: 'document.name', header: 'Document' },
        { field: 'transactionDate', header: 'TransactionDate' },
    ];
    
    @ViewChild('dt') table: Table;

    constructor(
        private daybookService: DaybookService,
    ) { }

    async ngOnInit() {
        this.daybooks = await this.daybookService.getAll();
        for (const iterator of this.daybooks) {
            iterator.transactionDate = moment(iterator.transactionDate).format('DD/MM/YYYY')
        }
        this.loading = false;
    }

    deleteDaybook(id: string) {
        const account = this.daybooks!.find(x => x.id === id);
        account.isDeleting = true;
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