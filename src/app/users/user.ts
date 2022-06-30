import { DataControl } from "@remult/angular/interfaces";
import { Allow, BackendMethod, Entity, Fields, IdEntity, isBackend, Validators } from "remult";
import { mobileFromDb, mobileToDb } from "../common/utils";
import { terms } from "../terms";
import { Roles } from './roles';

@Entity<User>("users", (options, remult) => {
    options.allowApiRead = Allow.authenticated
    options.allowApiUpdate = Allow.authenticated
    options.allowApiDelete = Roles.admin
    options.allowApiInsert = Roles.admin
    options.apiPrefilter = !remult.isAllowed(Roles.admin) ? { id: remult.user.id } : {};
    options.defaultOrderBy = {
        admin: "desc",
        bedekManager: "desc",
        bedek: "desc",
        professional: "desc",
        tenant: "desc",
        name: "asc"
    }
    options.saving = async (user) => {
        if (isBackend()) {
            if (user._.isNew()) {
                user.createDate = new Date();
            }
        }
    }
}
)
export class User extends IdEntity {

    @DataControl<User, string>({ width: '118' })
    @Fields.string({
        validate: [Validators.required],
        caption: terms.username
    })
    name = '';

    @DataControl<User, string>({ width: '108' })
    @Fields.string((options, remult) => {
        options.validate = [Validators.required, Validators.uniqueOnBackend]
        options.caption = terms.mobile
        options.valueConverter = {
            fromDb: col => mobileFromDb(mobileToDb(col) as string),
            toDb: col => mobileToDb(col) as string
        }
    })
    mobile = '';

    @Fields.string({ includeInApi: false })
    password = '';

    @Fields.date({
        allowApiUpdate: false
    })
    createDate = new Date();

    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.bedekManager = false
                row.bedek = false
                row.professional = false
                row.tenant = false
                row.buildingManager = false
                row.inspector = false
            }
        }
    })
    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.admin
    })
    admin = false;


    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.admin = false
                row.bedek = false
                row.professional = false
                row.tenant = false
                row.buildingManager = false
                row.inspector = false
            }
        }
    })
    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.manager
    })
    bedekManager = false;

    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.admin = false
                row.bedekManager = false
                row.professional = false
                row.tenant = false
                row.buildingManager = false
                row.inspector = false
            }
        }
    })
    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.bedek
    })
    bedek = false;

    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.admin = false
                row.bedek = false
                row.professional = false
                row.tenant = false
                row.inspector = false
            }
        }
    })
    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: 'מנהל עבודה'
    })
    buildingManager = false;

    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.admin = false
                row.bedek = false
                row.professional = false
                row.tenant = false
            }
        }
    })
    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: 'מפקח'
    })
    inspector = false;

    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.admin = false
                row.bedekManager = false
                row.bedek = false
                row.tenant = false
                row.buildingManager = false
                row.inspector = false
            }
        }
    }) @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.professional
    })
    professional = false;

    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.admin = false
                row.bedekManager = false
                row.bedek = false
                row.professional = false
                row.buildingManager = false
                row.inspector = false
            }
        }
    }) @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.tenant
    })
    tenant = false;

    async hashAndSetPassword(password: string) {
        this.password = (await import('password-hash')).generate(password);
    }
    async passwordMatches(password: string) {
        return !this.password || (await import('password-hash')).verify(password, this.password);
    }
    @BackendMethod({ allowed: Roles.admin })
    async resetPassword() {
        this.password = '';
        await this.save();
    }
}