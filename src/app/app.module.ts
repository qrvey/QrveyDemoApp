import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { ReportsComponent } from './components/reports/reports.component';
import { LeftbarComponent } from './components/reports/leftbar/leftbar.component';
import { ActionsComponent } from './components/reports/actions/actions.component';
import { AdminComponent } from './components/admin/admin.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NewReportComponent } from './components/reports/new-report/new-report.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { CardComponent } from './components/admin/card/card.component';
import { TenantInfoComponent } from './components/admin/tenant-info/tenant-info.component';
import { PublishComponent } from './components/reports/publish/publish.component';
import { DeploymentStatusComponent } from './components/reports/deployment-status/deployment-status.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TopbarComponent,
    ReportsComponent,
    LeftbarComponent,
    ActionsComponent,
    AdminComponent,
    DatasetsComponent,
    LoadingComponent,
    NewReportComponent,
    ConfirmationModalComponent,
    CardComponent,
    TenantInfoComponent,
    PublishComponent,
    DeploymentStatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
