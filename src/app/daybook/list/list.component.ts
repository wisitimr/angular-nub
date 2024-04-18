import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { DaybookService } from '../daybook.service';
import * as moment from 'moment';
import { FileService } from 'src/app/_services/file.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { AuthService } from 'src/app/auth/auth.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    searchForm!: FormGroup;
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
    years: any = [];

    @ViewChild('dt') table: Table;

    constructor(
        private daybookService: DaybookService,
        private fileService: FileService,
        private formBuilder: FormBuilder,
        private authService: AuthService,
    ) { }

    async ngOnInit() {
        const now = new Date()
        this.years = await this.listYear(now.getFullYear() - 5)
        this.searchForm = this.formBuilder.group({
            year: [now.getFullYear(), Validators.required],
        });
        await this.search()
        this.loading = false;
    }

    async search() {
        this.loading = true;
        var query = {};
        query['company'] = this.authService.userValue.company && this.authService.userValue.company.id;
        query['transactionDate.gte'] = `${this.searchForm.value.year}-01-01T00:00:00.000Z`;
        query['transactionDate.lt'] = `${Number(this.searchForm.value.year) + 1}-01-01T00:00:00.000Z`;
        this.daybooks = await this.daybookService.getAll(query);
        for (const iterator of this.daybooks) {
            iterator.transactionDate = moment(iterator.transactionDate).format('DD/MM/YYYY')
        }
        this.loading = false;
    }

    async listYear(startYear) {
        var currentYear = new Date().getFullYear(), years = [];
        while (startYear <= currentYear) {
            years.push(currentYear--);
        }
        return years;
    }

    async downloadDaybook(row: any) {
        this.isDownloading = true;
        const [blob, fileName]: any = await this.daybookService.generateExcel(row.id);
        console.log('fileName : ', fileName);

        this.fileService.downloadFile(blob, fileName)
        this.isDownloading = false
    }

    deleteDaybook(id: string) {
        this.isDeleting = true;
        const account = this.daybooks!.find(x => x.id === id);
        this.isDeleting = false;
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