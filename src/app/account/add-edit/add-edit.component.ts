import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first, takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/_components/alert/alert.service';
import { AccountService } from '../account.service';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { BaseComponent } from 'src/app/_components/base.component';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent extends BaseComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitted = false;
    accountTypes: any = [];

    @ViewChild('accountTypeSelect', { static: true }) accountTypeSelect: MatSelect;

    /** control for the MatSelect filter keyword */
    public accountTypeFilterCtrl: FormControl<string> = new FormControl<string>('');

    /** list of banks filtered by search keyword */
    public filteredAccountTypes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {
        super()
    }

    async ngOnInit() {
        this.loading = true;
        await this.getAccountType()
        this.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            description: [''],
            type: [''],
        });

        this.title = 'Add Account';
        if (this.id) {
            // edit mode
            this.title = 'Edit Account';
            const user = await this.accountService.getById(this.id)
            this.form.patchValue(user);
        }
        this.initFilter()
        this.loading = false;
    }

    initFilter() {
        // load the initial list
        this.filteredAccountTypes.next(this.accountTypes.slice());

        // listen for search field value changes
        this.accountTypeFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterAccountTypes();
            });
    }

    protected filterAccountTypes() {
        if (!this.accountTypes) {
            return;
        }
        // get the search keyword
        let search = this.accountTypeFilterCtrl.value;
        if (!search) {
            this.filteredAccountTypes.next(this.accountTypes.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredAccountTypes.next(
            this.accountTypes.filter(accountType => accountType.name.toLowerCase().indexOf(search) > -1)
        );
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    async getAccountType() {
        this.accountTypes = await this.accountService.getAccountType();
    }


    async onSubmit() {
        this.submitted = true
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        try {
            var res = await this.save();
            if (res) {
                this.alertService.success('Account saved', { keepAfterRouteChange: true });
                this.router.navigateByUrl('/account');
            }
        } catch (error) {
            this.alertService.error(error);
        } finally {
            this.submitted = false
        }
    }

    private save() {
        // create or update user based on id param
        return this.id
            ? this.accountService.update(this.id!, this.form.value)
            : this.accountService.add(this.form.value);
    }
}