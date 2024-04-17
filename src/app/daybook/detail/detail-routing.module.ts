import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailAddEditComponent } from './add-edit/add-edit.component';

const routes: Routes = [
    {
        path: 'add',
        component: DetailAddEditComponent
    },
    {
        path: 'edit/:detailId',
        component: DetailAddEditComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DaybookDetailRoutingModule { }