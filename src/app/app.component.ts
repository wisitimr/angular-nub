import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { User } from './_models';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
})
export class AppComponent {
    isLoggedIn: boolean;
    user?: User | null;

    constructor(
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
       this.setLogggedIn();
    }

    setLogggedIn() {
        this.authService.user.subscribe(x => this.user = x);
        if (this.user) {
            this.isLoggedIn = true;
        }
    }
}