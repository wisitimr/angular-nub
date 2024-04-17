import { NgModule } from '@angular/core';
import { DaybookDetailRoutingModule } from './detail-routing.module';
import { SharedModule } from '../../shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DetailAddEditComponent } from './add-edit/add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        DaybookDetailRoutingModule,
    ],
    declarations: [
        DetailAddEditComponent, 
    ]
})
export class DaybookDetailModule { }