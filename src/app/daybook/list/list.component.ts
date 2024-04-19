import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { DaybookService } from '../daybook.service';
import * as moment from 'moment';
import { FileService } from 'src/app/_services/file.service';
import { AuthService } from 'src/app/auth/auth.service';
import { NotyService } from 'src/app/_services/noty.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    daybooks?: any[];
    loading: boolean = false;
    isDeleting: boolean = false;
    isDownloading: boolean = false;
    cols?: any = [
        { field: 'number', header: 'Number' },
        { field: 'invoice', header: 'Invoice' },
        { field: 'document.name', header: 'Document' },
        { field: 'transactionDate', header: 'TransactionDate' },
    ];

    @ViewChild('dt') table: Table;

    constructor(
        private daybookService: DaybookService,
        private fileService: FileService,
        private authService: AuthService,
        private noty: NotyService
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        this.search()
    }

    async search() {
        try {
            this.daybooks = await this.daybookService.getAll({
                company: this.authService.userValue && this.authService.userValue.company && this.authService.userValue.company.id
            });
            for (const iterator of this.daybooks) {
                iterator.transactionDate = moment(iterator.transactionDate).format('DD/MM/YYYY')
            }
        } catch (error) {
            this.noty.error(error)
        } finally {
            this.loading = false;
        }
    }

    async downloadDaybook(row: any) {
        this.isDownloading = true;
        const [blob, fileName]: any = await this.daybookService.generateExcel(row.id);
        this.fileService.downloadFile(blob, fileName)
        this.isDownloading = false
    }

    deleteDaybook(id: string) {
        const daybook = this.daybooks!.find(x => x.id === id);
        daybook.isDeleting = false;
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