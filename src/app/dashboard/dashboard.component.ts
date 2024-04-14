import { Component, ViewChild } from '@angular/core';

import { User } from '../_models';
import { AuthService } from '../auth/auth.service';
import { SidenavComponent } from '../_components';

@Component({ templateUrl: 'dashboard.component.html' })
export class DashboardComponent {
    user: User | null;

    constructor(private authService: AuthService) {
        this.user = this.authService.userValue;
    }

    // onActive() {
    //     this.sidenav.ngDoCheck()
    // }
}