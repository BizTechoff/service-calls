import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RemultModule } from '@remult/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogService } from './common/dialog';
import { InputAreaComponent } from './common/input-area/input-area.component';
import { YesNoQuestionComponent } from './common/yes-no-question/yes-no-question.component';
import { HomeComponent } from './home/home.component';
import { AdminGuard, AdminOrManagerGuard, BedekGuard, ManagerGuard, SubContractorGuard, TenantGuard } from "./users/AuthGuard";
import { UsersComponent } from './users/users.component';
import { RequestDetailsComponent } from './core/request/request-details/request-details.component';
import { RequestsComponent } from './core/request/requests/requests.component';
import { ProjectsComponent } from './core/project/projects/projects.component';
import { TenantsComponent } from './core/tenant/tenants/tenants.component';
import { ComplexesComponent } from './core/complex/complexes/complexes.component';
import { BuildingsComponent } from './core/building/buildings/buildings.component';
import { ApartmentsComponent } from './core/apartment/apartments/apartments.component';
import { TenantDetailsComponent } from './core/tenant/tenant-details/tenant-details.component';
import { SubContractorsComponent } from './core/sub-contractor/sub-contractors/sub-contractors.component';
import { InspectorsComponent } from './core/inspector/inspectors/inspectors.component';
import { ConstructionContractorsComponent } from './core/construction-contractor/construction-contractors/construction-contractors.component';
import { CurrentStateComponent } from './core/current-state/current-state.component';

import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    HomeComponent,
    YesNoQuestionComponent,
    InputAreaComponent,
    RequestDetailsComponent,
    RequestsComponent,
    ProjectsComponent,
    TenantsComponent,
    ComplexesComponent,
    BuildingsComponent,
    ApartmentsComponent,
    TenantDetailsComponent,
    SubContractorsComponent,
    InspectorsComponent,
    ConstructionContractorsComponent,
    CurrentStateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RemultModule,
    ChartsModule  
  ],
  providers: [DialogService, AdminGuard, ManagerGuard, BedekGuard, SubContractorGuard, TenantGuard
    , AdminOrManagerGuard],
  bootstrap: [AppComponent],
  entryComponents: [YesNoQuestionComponent, InputAreaComponent]
})
export class AppModule { }
