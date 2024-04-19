import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotyService } from 'src/app/_services/noty.service';
import { ProductService } from '../product.service';
import { BaseComponent } from 'src/app/_components/base.component';
import { AuthService } from 'src/app/auth/auth.service';

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
        private productService: ProductService,
        private noty: NotyService,
        private authService: AuthService,
    ) {
        super()
     }

    async ngOnInit() {
        this.loading = true;
        this.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            description: ['', Validators.required],
            price: ['', Validators.required],
            company: [this.authService.userValue.company && this.authService.userValue.company.id, Validators.required]
        });

        this.title = 'Add Product';
        if (this.id) {
            // edit mode
            this.title = 'Edit Product';
            const product = await this.productService.getById(this.id)
            this.form.patchValue(product);
        }
        this.loading = false;
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    async onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        
        try {
            var res = await this.save();
            if (res) {
                this.noty.success('Product saved');
                this.router.navigateByUrl('/product');
            }
        } catch (error) {
            this.noty.error(error);
            this.submitting = false;
        } finally {
            this.submitted = false
        }
    }

    private save() {
        // create or update user based on id param
        return this.id
            ? this.productService.update(this.id!, this.form.value)
            : this.productService.add(this.form.value);
    }
}