import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_helpers';
import { UsersModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { SupplierModule } from './supplier/supplier.module';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { MaterialModule } from './material/material.module';
import { DaybookModule } from './daybook/daybook.module';

const routes: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => DashboardModule,
        canActivate: [AuthGuard]
    },
    {
        path: 'daybook',
        loadChildren: () => DaybookModule,
        canActivate: [AuthGuard]
    },
    {
        path: 'user',
        loadChildren: () => UsersModule,
        canActivate: [AuthGuard]
    },
    {
        path: 'account',
        loadChildren: () => AccountModule,
        canActivate: [AuthGuard]
    },
    {
        path: 'supplier',
        loadChildren: () => SupplierModule,
        canActivate: [AuthGuard]
    },
    {
        path: 'customer',
        loadChildren: () => CustomerModule,
        canActivate: [AuthGuard]
    },
    {
        path: 'product',
        loadChildren: () => ProductModule,
        canActivate: [AuthGuard]
    },
    {
        path: 'material',
        loadChildren: () => MaterialModule,
        canActivate: [AuthGuard]
    },
    {
        path: 'auth',
        loadChildren: () => AuthModule
    },

    // otherwise redirect to dashboard
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }