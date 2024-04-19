import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from '../user.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users?: any[];
    loading: boolean = true;
    cols?: any = [
        { field: 'username', header: 'Username' },
        { field: 'fullName', header: 'Full Name' },
    ];
    @ViewChild('dt') table: Table;

    constructor(
        private userService: UserService,
    ) { }

    async ngOnInit() {
        window.scrollTo(0, 0);
        this.users = await this.userService.getAll();
        this.loading = false;
    }

    deleteUser(id: string) {
        const user = this.users!.find(x => x.id === id);
        user.isDeleting = true;
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.users = this.users!.filter(x => x.id !== id));
    }
}