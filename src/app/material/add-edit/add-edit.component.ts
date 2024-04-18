import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotyService } from 'src/app/_services/noty.service';
import { MaterialService } from '../material.service';
import { BaseComponent } from 'src/app/_components/base.component';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent extends BaseComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private materialService: MaterialService,
        private noty: NotyService
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
        });

        this.title = 'Add Material';
        if (this.id) {
            // edit mode
            this.title = 'Edit Material';
            const material = await this.materialService.getById(this.id)
            this.form.patchValue(material);
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
                this.noty.success('Material saved');
                this.router.navigateByUrl('/material');
            }
        } catch (error) {
            this.noty.error(error);
        } finally {
            this.submitted = false
        }
    }

    private save() {
        // create or update user based on id param
        return this.id
            ? this.materialService.update(this.id!, this.form.value)
            : this.materialService.add(this.form.value);
    }
}