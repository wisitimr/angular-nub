import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './user-routing.module';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add_edit/add_edit.component';
import { SharedModule } from '../shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        UsersRoutingModule,
    ],
    declarations: [
        ListComponent, 
        AddEditComponent,
    ]
})
export class UsersModule { }