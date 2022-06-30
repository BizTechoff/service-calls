import { AuthenticatedGuard } from '@remult/angular';
import { Injectable } from '@angular/core';
import { Roles } from './roles';

@Injectable()
export class AdminGuard extends AuthenticatedGuard {

    override isAllowed() {
        return Roles.admin;
    }
}

@Injectable()
export class ManagerGuard extends AuthenticatedGuard {

    override isAllowed() {
        return Roles.bedekManager;
    }
}

@Injectable()
export class BedekGuard extends AuthenticatedGuard {

    override isAllowed() {
        return Roles.bedek;
    }
}

@Injectable()
export class ProfessionalGuard extends AuthenticatedGuard {

    override isAllowed() {
        return Roles.professional;
    }
}

@Injectable()
export class TenantGuard extends AuthenticatedGuard {

    override isAllowed() {
        return Roles.tenant;
    }
}

@Injectable()
export class AdminOrManagerGuard extends AuthenticatedGuard {

    override isAllowed() {
        return [Roles.admin,Roles.bedekManager];
    }
}
