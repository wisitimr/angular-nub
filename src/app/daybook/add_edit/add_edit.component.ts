import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_components/alert/alert.service';
import { DaybookService } from '../daybook.service';
import { MsService } from 'src/app/_services/master.service';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';

@Component({ templateUrl: 'add_edit.component.html' })
export class AddEditComponent implements OnInit, OnDestroy {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    documentType: string;
    msPaymentMethod: any = [];
    msDocument: any = [];
    msSupplier: any = [];
    msCustomer: any = [];

    @ViewChild('docSelect', { static: true }) docSelect: MatSelect;
    @ViewChild('supplierSelect', { static: true }) supplierSelect: MatSelect;
    @ViewChild('customerSelect', { static: true }) customerSelect: MatSelect;
    @ViewChild('paymentMethodSelect', { static: true }) paymentMethodSelect: MatSelect;

    /** control for the MatSelect filter keyword */
    public docFilterCtrl: FormControl<string> = new FormControl<string>('');
    public supplierFilterCtrl: FormControl<string> = new FormControl<string>('');
    public customerFilterCtrl: FormControl<string> = new FormControl<string>('');
    public paymentMethodFilterCtrl: FormControl<string> = new FormControl<string>('');

    /** list of banks filtered by search keyword */
    public filteredDocs: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public filteredSuppliers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public filteredCustomers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public filteredPaymentMethods: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private daybookService: DaybookService,
        private alertService: AlertService,
        private msService: MsService
    ) { }

    async ngOnInit() {
        await Promise.all([
            this.getMsPaymentMethod(),
            this.getMsDocument(),
            this.getMsSupplier(),
            this.getMsCustomer(),
        ])
        this.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            number: ['', Validators.required],
            invoice: ['', Validators.required],
            document: ['', Validators.required],
            transactionDate: ['', Validators.required],
            supplier: ['', Validators.required],
            customer: ['', Validators.required],
            paymentMethod: ['', Validators.required],
        });

        this.title = 'Add สมุดรายวัน';
        if (this.id) {
            // edit mode
            this.title = 'Edit สมุดรายวัน';
            this.loading = true;
            const user = await this.daybookService.getById(this.id)
            user.transactionDate = user.transactionDate ? new Date(user.transactionDate) : new Date()
            this.form.patchValue(user);
            this.loading = false;
        }

        if (this.form.value.document) {
            var res = this.msDocument.find(ms => ms.id == this.form.value.document);
            if (res && res.code) {
                this.documentType = res.code;
            }
        }
        this.initFilter()
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    initFilter() {
        // set initial selection
        this.docFilterCtrl.setValue(this.msDocument[10]);
        this.supplierFilterCtrl.setValue(this.msSupplier[10]);
        this.customerFilterCtrl.setValue(this.msCustomer[10]);
        this.paymentMethodFilterCtrl.setValue(this.msPaymentMethod[10]);

        // load the initial bank list
        this.filteredDocs.next(this.msDocument.slice());
        this.filteredSuppliers.next(this.msSupplier.slice());
        this.filteredCustomers.next(this.msCustomer.slice());
        this.filteredPaymentMethods.next(this.msPaymentMethod.slice());

        // listen for search field value changes
        this.docFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterDocs();
            });
        this.supplierFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterDocs();
            });
        this.customerFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterDocs();
            });
        this.paymentMethodFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterDocs();
            });

        // set initial selection
        this.docFilterCtrl.setValue(this.msDocument[10]);
        this.supplierFilterCtrl.setValue(this.msSupplier[10]);
        this.customerFilterCtrl.setValue(this.msCustomer[10]);
        this.paymentMethodFilterCtrl.setValue(this.msPaymentMethod[10]);

        // load the initial bank list
        this.filteredDocs.next(this.msDocument.slice());
        this.filteredSuppliers.next(this.msSupplier.slice());
        this.filteredCustomers.next(this.msCustomer.slice());
        this.filteredPaymentMethods.next(this.msPaymentMethod.slice());

        // listen for search field value changes
        this.docFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterDocs();
            });
        this.supplierFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterSuppliers();
            });
        this.customerFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterCustomers();
            });
        this.paymentMethodFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterPaymentMethods();
            });
    }

    protected filterDocs() {
        if (!this.msDocument) {
            return;
        }
        // get the search keyword
        let search = this.docFilterCtrl.value;
        if (!search) {
            this.filteredDocs.next(this.msDocument.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredDocs.next(
            this.msDocument.filter(doc => doc.name.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterSuppliers() {
        if (!this.msSupplier) {
            return;
        }
        // get the search keyword
        let search = this.supplierFilterCtrl.value;
        if (!search) {
            this.filteredSuppliers.next(this.msSupplier.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredSuppliers.next(
            this.msSupplier.filter(supplier => supplier.name.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterCustomers() {
        if (!this.msCustomer) {
            return;
        }
        // get the search keyword
        let search = this.customerFilterCtrl.value;
        if (!search) {
            this.filteredCustomers.next(this.msCustomer.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredCustomers.next(
            this.msCustomer.filter(customer => customer.name.toLowerCase().indexOf(search) > -1)
        );
    }

    protected filterPaymentMethods() {
        if (!this.msPaymentMethod) {
            return;
        }
        // get the search keyword
        let search = this.paymentMethodFilterCtrl.value;
        if (!search) {
            this.filteredPaymentMethods.next(this.msPaymentMethod.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredPaymentMethods.next(
            this.msPaymentMethod.filter(customer => customer.name.toLowerCase().indexOf(search) > -1)
        );
    }

    async getMsPaymentMethod() {
        this.msPaymentMethod = await this.msService.getPaymentMethod();
    }

    async getMsDocument() {
        this.msDocument = await this.msService.getDocument();
    }

    async getMsSupplier() {
        this.msSupplier = await this.msService.getSupplier();
    }

    async getMsCustomer() {
        this.msCustomer = await this.msService.getCustomer();
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
                this.alertService.success('Daybook saved', { keepAfterRouteChange: true });
                this.router.navigateByUrl('/daybook');
            }
        } catch (error) {
            this.alertService.error(error);
            this.submitting = false;
        }
    }

    private save() {
        // create or update user based on id param
        return this.id
            ? this.daybookService.update(this.id!, this.form.value)
            : this.daybookService.add(this.form.value);
    }
}