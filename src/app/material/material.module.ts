import { NgModule } from '@angular/core';
import { MaterialRoutingModule } from './material-routing.module';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { SharedModule } from '../shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        MaterialRoutingModule,
    ],
    declarations: [
        ListComponent, 
        AddEditComponent,
    ]
})
export class MaterialModule { }