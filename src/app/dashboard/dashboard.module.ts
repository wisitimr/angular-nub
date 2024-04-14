import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        // SharedModule,
        DashboardRoutingModule,
    ],
    declarations: [
        DashboardComponent
    ]
})
export class DashboardModule { }