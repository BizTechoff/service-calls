import { DataControl } from "@remult/angular/interfaces";
import { Allow, BackendMethod, Entity, Field, Fields, IdEntity, isBackend, Validators } from "remult";
import { mobileFromDb, mobileToDb } from "../common/utils";
import { Category } from "../core/request/category";
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
        inspector: "desc",
        constructionContractor: "desc",
        subContractor: "desc",
        tenant: "desc",
        name: "asc"
    }
    options.saving = async (user) => {
        if (isBackend()) {
            if (user._.isNew()) {
                user.createDate = new Date();
            }
            if (!user.password) {
                user.hashAndSetPassword(process.env['DEFAULT_PASSWORD']!)
            }
        }
    }
}
)
export class User extends IdEntity {

    @DataControl<User, string>({ width: '118' })
    @Fields.string<User>((options, remult) => {
        options.validate = [Validators.required]
        options.caption = terms.username
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

    @DataControl<User, string>({ width: '108' })
    @Fields.string((options, remult) => {
        // options.validate = [Validators.required, Validators.uniqueOnBackend]
        options.caption = 'אימייל'
    })
    email = '';

    @Fields.string({ includeInApi: false })
    password = '';

    @Fields.date({
        allowApiUpdate: false
    })
    createDate = new Date();

    @Field<User, Category>(() => Category, (options, remult) => {
        // options.allowApiUpdate = false
        options.caption = 'מחלקה'
        options.validate = (row, col) => {
            if (row.subContractor) {
                if (!col?.value) {
                    col.error = terms.requiredField
                }
            }
        }
    })
    category!: Category

    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.bedekManager = false
                row.bedek = false
                row.inspector = false
                row.constructionContractor = false
                row.subContractor = false
                row.tenant = false
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
                row.subContractor = false
                row.tenant = false
                row.constructionContractor = false
                row.inspector = false
            }
        }
    })
    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.bedekManager
    })
    bedekManager = false;

    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.admin = false
                row.bedekManager = false
                row.subContractor = false
                row.tenant = false
                row.constructionContractor = false
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
                row.subContractor = false
                row.tenant = false
                row.inspector = false
            }
        }
    })
    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.constructionContractor
    })
    constructionContractor = false;

    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.admin = false
                row.bedek = false
                row.subContractor = false
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
                row.bedek = false
                row.subContractor = false
                row.tenant = false
                row.inspector = false
            }
        }
    })
    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.workManager
    })
    workManager = false;

    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.admin = false
                row.bedekManager = false
                row.bedek = false
                row.tenant = false
                row.constructionContractor = false
                row.inspector = false
            }
        }
    }) @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.subContractor
    })
    subContractor = false;

    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.admin = false
                row.bedekManager = false
                row.bedek = false
                row.subContractor = false
                row.constructionContractor = false
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