import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_components/alert/alert.service';
import { SupplierService } from '../supplier.service';

@Component({ templateUrl: 'add_edit.component.html' })
export class AddEditComponent implements OnInit {
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
        private supplierService: SupplierService,
        private alertService: AlertService
    ) { }

    async ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            address: ['', Validators.required],
            phone: ['', Validators.required],
            contact: ['', Validators.required],
        });

        this.title = 'Add Supplier';
        if (this.id) {
            // edit mode
            this.title = 'Edit Supplier';
            this.loading = true;
            const user = await this.supplierService.getById(this.id)
            this.form.patchValue(user);
            this.loading = false;
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    async onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        try {
            var res = await this.save();
            if (res) {
                this.alertService.success('Account saved', { keepAfterRouteChange: true });
                this.router.navigateByUrl('/user');
            }
        } catch (error) {
            this.alertService.error(error);
            this.submitting = false;
        }
    }

    private save() {
        // create or update user based on id param
        return this.id
            ? this.supplierService.update(this.id!, this.form.value)
            : this.supplierService.add(this.form.value);
    }
}