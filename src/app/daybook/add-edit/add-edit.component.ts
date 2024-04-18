import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DaybookService } from '../daybook.service';
import { MsService } from 'src/app/_services/master.service';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { BaseComponent } from 'src/app/_components/base.component';
import { NotyService } from 'src/app/_services/noty.service';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent extends BaseComponent implements OnInit, OnDestroy {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitted = false;
    documentType: string;
    msPaymentMethod: any = [];
    msDocument: any = [];
    msSupplier: any = [];
    msCustomer: any = [];
    daybookDetails: any = [];

    cols?: any = [
        { field: 'name', header: 'Name' },
        { field: 'type', header: 'Type' },
        { field: 'amount', header: 'Amount', type: 'number' },
    ];

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
        private noty: NotyService,
        private msService: MsService
    ) {
        super()
    }

    async ngOnInit() {
        window.scrollTo(0, 0);
        this.loading = true;
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
            supplier: [''],
            customer: [''],
            paymentMethod: ['', Validators.required],
        });

        this.title = 'Add สมุดรายวัน';
        if (this.id) {
            // edit mode
            this.title = 'Edit สมุดรายวัน';
            const daybook = await this.daybookService.getById(this.id)
            daybook.transactionDate = daybook.transactionDate ? new Date(daybook.transactionDate) : new Date()
            if (daybook.daybookDetails) {
                this.daybookDetails = [];
                for (const detail of daybook.daybookDetails) {
                    detail.amount = this.formatPrice(detail.amount)
                    this.daybookDetails.push(detail)
                }
            }
            this.form.patchValue(daybook);
        }

        this.setDocumentType(this.form.value.document)
        this.initFilter()
        this.loading = false;
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    initFilter() {
        // load the initial list
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

    async setDocumentType(document) {
        if (document) {
            var res = this.msDocument.find(ms => ms.id == this.form.value.document);
            if (res && res.code) {
                this.documentType = res.code;
            }
            switch (this.documentType) {
                case 'PAY':
                    this.form.controls['customer'].clearValidators()
                    this.form.controls['supplier'].setValidators(Validators.required)
                    break;

                case 'REC':
                    this.form.controls['supplier'].clearValidators()
                    this.form.controls['customer'].setValidators(Validators.required)
                    break;
            }
        }
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
            this.msSupplier.filter(supplier => supplier.code.toLowerCase().indexOf(search) > -1 || supplier.name.toLowerCase().indexOf(search) > -1)
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
            this.msCustomer.filter(customer => customer.code.toLowerCase().indexOf(search) > -1 || customer.name.toLowerCase().indexOf(search) > -1)
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
        this.submitted = true

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        try {
            var res = await this.save();
            if (res) {
                this.noty.success('Daybook saved');
                this.router.navigateByUrl('/daybook');
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
            ? this.daybookService.update(this.id!, this.form.value)
            : this.daybookService.add(this.form.value);
    }

    deleteDaybookDetail(id: string) {
        // const account = this.daybookDet!.find(x => x.id === id);
        // account.isDeleting = true;
    }
}