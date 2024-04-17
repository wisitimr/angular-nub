import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { DetailAddEditComponent } from './detail/add-edit/add-edit.component';

const routes: Routes = [
    {
        path: '',
        component: ListComponent
    },
    {
        path: 'add',
        component: AddEditComponent
    },
    {
        path: 'edit/:id',
        component: AddEditComponent
    },
    {
        path: 'edit/:id/detail/add',
        component: DetailAddEditComponent
    },
    {
        path: 'edit/:id/detail/edit/:detailId',
        component: DetailAddEditComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DaybookRoutingModule { }