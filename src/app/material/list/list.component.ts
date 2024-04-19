import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MaterialService } from '../material.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    materials?: any[];
    loading: boolean = true;
    cols?: any = [
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
    ];
    @ViewChild('dt') table: Table;

    constructor(
        private materialService: MaterialService,
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        this.materials = await this.materialService.getAll();
        this.loading = false;
    }

    deleteMaterial(id: string) {
        const account = this.materials!.find(x => x.id === id);
        account.isDeleting = true;
    }
}