import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NotyService } from 'src/app/_services/noty.service';
import { AppComponent } from 'src/app/app.component';
import * as _ from 'lodash';
import { User } from 'src/app/_models';
import { Company } from 'src/app/_models/company';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    form!: FormGroup;
    companyForm!: FormGroup;
    loading = false;
    isSubmitted = false;
    showPassword: boolean = false;
    Companies: any = [];
    user: any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private noty: NotyService,
        private app: AppComponent
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.companyForm = this.formBuilder.group({
            id: ['', Validators.required],
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    async onSubmit() {
        this.isSubmitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        try {
            this.user = await this.authService.login(this.f.username.value, this.f.password.value);
            if (_.has(this.user, 'data.companies.length') && this.user.data.companies.length > 1) {
                this.form.controls['username'].disable()
                this.form.controls['password'].disable()
            } else {
                if (this.user.data.companies && this.user.data.companies.length) {
                    const company = this.user.data.companies[0];
                    var c = new Company();
                    c.id = company.id;
                    c.name = company.name;
                    this.user.data.company = c;
                }
                this.loginSucceeded(this.user.data)
            }
        } catch (error) { 
            this.noty.error(error);
            this.loading = false;
        }
    }

    showOrHide() {
        this.showPassword = !this.showPassword;
    }

    selectCompany() {
        const id = this.companyForm.value.id;
        if (this.user.data.companies && this.user.data.companies.length) {
            const company = this.user.data.companies.find(item => item.id == id);
            if (company) {
                var c = new Company();
                c.id = company.id;
                c.name = company.name;
                this.user.data.company = c;
            }
        }
        this.loginSucceeded(this.user.data)
    }

    cancelSelectCompany() {
        this.user = null
        this.companyForm.controls['id'].setValue('')
        this.form.controls['username'].enable()
        this.form.controls['password'].enable()
        this.authService.clear()
    }

    loginSucceeded(user) {
        delete this.user.data.companies;
        localStorage.setItem('user', JSON.stringify(user));
        this.authService.userSubject.next(user);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.app.setLogggedIn();
        this.router.navigateByUrl(returnUrl);
    }
}