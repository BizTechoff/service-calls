import { NotAuthenticatedGuard, RemultModule } from '@remult/angular';
import { NgModule, ErrorHandler } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';


import { UsersComponent } from './users/users.component';
import { AdminGuard, AdminOrManagerGuard } from "./users/AuthGuard";
import { ShowDialogOnErrorErrorHandler } from './common/dialog';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { terms } from './terms';

const defaultRoute = terms.home;
const routes: Routes = [
  { path: defaultRoute, component: HomeComponent, canActivate: [NotAuthenticatedGuard] },
  { path: terms.projects, component: UsersComponent, canActivate: [AdminOrManagerGuard] },
  { path: terms.workManager, component: UsersComponent, canActivate: [AdminOrManagerGuard] },
  { path: terms.seviceCalls, component: UsersComponent, canActivate: [AdminOrManagerGuard] },
  { path: terms.reports, component: UsersComponent, canActivate: [AdminOrManagerGuard] },
  { path: terms.professionals, component: UsersComponent, canActivate: [AdminOrManagerGuard] },
  // { path: terms.tenants, component: UsersComponent, canActivate: [AdminOrManagerGuard] },
  { path: terms.userAccounts, component: UsersComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '/'+defaultRoute, pathMatch: 'full' }
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
