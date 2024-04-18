import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotyService } from 'src/app/_services/noty.service';
import { CustomerService } from '../customer.service';
import { BaseComponent } from 'src/app/_components/base.component';

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
        private customerService: CustomerService,
        private noty: NotyService
    ) { 
        super()
    }

    async ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            address: [''],
            phone: [''],
            contact: [''],
        });

        this.title = 'Add Customer';
        if (this.id) {
            // edit mode
            this.title = 'Edit Customer';
            this.loading = true;
            const customer = await this.customerService.getById(this.id)
            this.form.patchValue(customer);
            this.loading = false;
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    async onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        try {
            var res = await this.save();
            if (res) {
                this.noty.success('Customer saved');
                this.router.navigateByUrl('/customer');
            }
        } catch (error) {
            this.noty.error(error);
            this.submitting = false;
        }
    }

    private save() {
        // create or update user based on id param
        return this.id
            ? this.customerService.update(this.id!, this.form.value)
            : this.customerService.add(this.form.value);
    }
}