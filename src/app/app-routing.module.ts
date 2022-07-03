import { ErrorHandler, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotAuthenticatedGuard, RemultModule } from '@remult/angular';
import { HomeComponent } from './home/home.component';


import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { ShowDialogOnErrorErrorHandler } from './common/dialog';
import { ProjectsComponent } from './core/project/projects/projects.component';
import { RequestsComponent } from './core/request/requests/requests.component';
import { terms } from './terms';
import { AdminGuard, AdminOrManagerGuard } from "./users/AuthGuard";
import { UsersComponent } from './users/users.component';
import { ComplexesComponent } from './core/complex/complexes/complexes.component';
import { BuildingsComponent } from './core/building/buildings/buildings.component';
import { ApartmentsComponent } from './core/apartment/apartments/apartments.component';
import { TenantsComponent } from './core/tenant/tenants/tenants.component';

const defaultRoute = terms.home;
const routes: Routes = [
  { path: defaultRoute, component: HomeComponent, canActivate: [NotAuthenticatedGuard] },
  { path: terms.projects, component: ProjectsComponent, canActivate: [AdminOrManagerGuard] },
  { path: terms.tenants, component: TenantsComponent, canActivate: [AdminOrManagerGuard] },
  { path: terms.requests, component: RequestsComponent, canActivate: [AdminOrManagerGuard] },
  { path: terms.complexes, component: ComplexesComponent, canActivate: [AdminOrManagerGuard] },
  { path: terms.buildings, component: BuildingsComponent, canActivate: [AdminOrManagerGuard] },
  { path: terms.apartments, component: ApartmentsComponent, canActivate: [AdminOrManagerGuard] },
  { path: terms.workManager, component: UsersComponent, canActivate: [AdminOrManagerGuard] },
  { path: terms.professionals, component: UsersComponent, canActivate: [AdminOrManagerGuard] },
  { path: terms.reports, component: UsersComponent, canActivate: [AdminOrManagerGuard] },
  // { path: terms.tenants, component: UsersComponent, canActivate: [AdminOrManagerGuard] },
  { path: terms.userAccounts, component: UsersComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '/' + defaultRoute, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    RemultModule,
  JwtModule.forRoot({
    config: { tokenGetter: () => AuthService.fromStorage() }
  })],
  providers: [AdminGuard, { provide: ErrorHandler, useClass: ShowDialogOnErrorErrorHandler }],
  exports: [RouterModule]
})
export class AppRoutingModule { }
