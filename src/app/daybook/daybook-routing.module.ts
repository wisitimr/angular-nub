import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { DaybookDetailModule } from './detail/detail.module';

const routes: Routes = [
    { path: '', component: ListComponent },
    { path: 'add', component: AddEditComponent },
    {
        path: 'edit/:id',
        component: AddEditComponent,
        children: [
            {
                path: 'detail',
                loadChildren: () => DaybookDetailModule,
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DaybookRoutingModule { }