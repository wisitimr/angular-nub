import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/user/user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseComponent } from 'src/app/_components/base.component';
import { NotyService } from 'src/app/_services/noty.service';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent extends BaseComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private authService: AuthService,
        private noty: NotyService
    ) {
        super()
    }

    async ngOnInit() {
        this.loading = true;
        this.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            email: ['',
                [
                    Validators.required,
                    Validators.pattern(
                        '^[a-zA-Z0-9.\\-_]+[@][a-zA-Z0-9-_]*[.][a-zA-Z0-9.\\-_]+'
                    ),
                ],],
            // password only required in add mode
            // password: ['', [Validators.minLength(6), ...(!this.id ? [Validators.required] : [])]]
        });

        this.title = 'Add User';
        if (this.id) {
            // edit mode
            this.title = 'Edit User';
            const user = await this.userService.getById(this.id)
            this.form.patchValue(user);
        }
        this.loading = false;
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.saveUser()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.noty.success('User saved');
                    this.router.navigateByUrl('/user');
                },
                error: error => {
                    this.noty.error(error);
                    this.submitting = false;
                }
            })
        this.submitted = false
    }

    private saveUser() {
        // create or update user based on id param
        return this.id
            ? this.userService.update(this.id!, this.form.value)
            : this.authService.register(this.form.value);
    }
}