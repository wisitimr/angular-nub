import { NgModule } from '@angular/core';
import { DaybookRoutingModule } from './daybook-routing.module';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { SharedModule } from '../shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DaybookService } from './daybook.service';
import { DaybookDetailService } from './detail/detail.service';
import { DetailAddEditComponent } from './detail/add-edit/add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        DaybookRoutingModule,
    ],
    declarations: [
        ListComponent,
        AddEditComponent,
        DetailAddEditComponent
    ],
    providers: [DaybookService, DaybookDetailService]
})
export class DaybookModule { }