import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_components/alert/alert.service';
import { MsService } from 'src/app/_services/master.service';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { BaseComponent } from 'src/app/_components/base.component';
import { AccountService } from 'src/app/account/account.service';
import { DaybookDetailService } from '../detail.service';

@Component({ templateUrl: 'add-edit.component.html' })
export class DetailAddEditComponent extends BaseComponent implements OnInit, OnDestroy {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitted = false;
    accounts: any = [];
    paymentTypes: any = ['DR', 'CR'];

    @ViewChild('accountSelect', { static: true }) accountSelect: MatSelect;
    @ViewChild('paymentTypeSelect', { static: true }) paymentTypeSelect: MatSelect;

    /** control for the MatSelect filter keyword */
    public accountFilterCtrl: FormControl<string> = new FormControl<string>('');
    public paymentTypeFilterCtrl: FormControl<string> = new FormControl<string>('');

    /** list of banks filtered by search keyword */
    public filteredAccounts: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public filteredPaymentTypes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private daybookDetailService: DaybookDetailService,
        private alertService: AlertService,
        private accountService: AccountService,
    ) {
        super()
    }

    async ngOnInit() {
        this.loading = true;
        await this.getAccount();
        this.id = this.route.snapshot.params['detailId'];

        // form with validation rules
        this.form = this.formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            detail: ['', Validators.required],
            type: ['', Validators.required],
            amount: ['', Validators.required],
            daybook: ['', Validators.required],
            company: ['', Validators.required],
        });

        this.title = 'Add สมุดรายวัน';
        if (this.id) {
            // edit mode
            this.title = 'Edit สมุดรายวัน';
            const user = await this.daybookDetailService.getById(this.id)
            this.form.patchValue(user);
        }
        this.initFilter()
        this.loading = false;
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    initFilter() {
        // load the initial list
        this.filteredAccounts.next(this.accounts.slice());
        this.filteredPaymentTypes.next(this.paymentTypes.slice());

        // listen for search field value changes
        this.accountFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterAccounts();
            });

        this.paymentTypeFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterPaymentTypes();
            });
    }

    protected filterAccounts() {
        if (!this.accounts) {
            return;
        }
        // get the search keyword
        let search = this.accountFilterCtrl.value;
        if (!search) {
            this.filteredAccounts.next(this.accounts.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredAccounts.next(
            this.accounts.filter(account => account.name.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterPaymentTypes() {
        if (!this.paymentTypes) {
            return;
        }
        // get the search keyword
        let search = this.paymentTypeFilterCtrl.value;
        if (!search) {
            this.filteredPaymentTypes.next(this.paymentTypes.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredPaymentTypes.next(
            this.paymentTypes.filter(paymentType => paymentType.toLowerCase().indexOf(search) > -1)
        );
    }

    async getAccount() {
        this.accounts = await this.accountService.getAll();;
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

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
                this.alertService.success('DaybookDetail saved', { keepAfterRouteChange: true });
                this.router.navigateByUrl('/daybook');
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
            ? this.daybookDetailService.update(this.id!, this.form.value)
            : this.daybookDetailService.add(this.form.value);
    }

    deleteDaybookDetail(id: string) {
        // const account = this.daybookDet!.find(x => x.id === id);
        // account.isDeleting = true;
    }
}