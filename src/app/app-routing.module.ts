import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { TenantInfoComponent } from './components/admin/tenant-info/tenant-info.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { LoginComponent } from './components/login/login.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  {path: '', component: ReportsComponent},
  {path: 'shared-reports', component: ReportsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'admin/tenant/:tenantid', component: TenantInfoComponent},
  {path: 'admin/tenant', redirectTo: '/admin' , pathMatch: 'full'},
  {path: 'datasets', component: DatasetsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
