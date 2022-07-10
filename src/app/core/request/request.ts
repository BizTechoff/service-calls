import { DataControl } from "@remult/angular/interfaces";
import { Allow, Entity, Field, Fields, IdEntity, isBackend } from "remult";
import { terms } from "../../terms";
import { User } from "../../users/user";
import { Apartment } from "../apartment/apartment";
import { Building } from "../building/building";
import { Complex } from "../complex/complex";
import { Project } from "../project/project";
import { Category } from "./category";
import { RequestStatus } from "./requestStatus";
import { Space } from "./spaces";

@Entity<Request>('requests', (options, remult) => {
    options.caption = 'פנייה'
    options.allowApiCrud = Allow.authenticated
    options.validation = async row => {
        if (isBackend()) {
            if (row.status.isClose()) {
                if (row.workHours < 1) {
                    row._.error = 'מינימום שעה'
                }
                if (row.workerCount < 1) {
                    row._.error = 'מינימום אחד'
                }
            }
        }
    }
    options.backendPrefilter = () => // if removing this line? '()=>', call only once? every refresh?
        remult.user.isAdmin || remult.user.isBedek || remult.user.isBedekManager
            ? {}
            : remult.user.isBuildingManager
                ? { $or: [{ workManager: { $id: remult.user.id } }] }
                : remult.user.isInspector
                    ? { $or: [{ inspector: { $id: remult.user.id } }] }
                    : remult.user.isProfessional
                        ? { $or: [{ professional: { $id: remult.user.id } }] }
                        : remult.user.isTenant
                            ? { $or: [{ tenant: { $id: remult.user.id } }] }
                            : { id: remult.user.id }// need id$ ? whats diff ?
})
export class Request extends IdEntity {

    @Field<Request, Project>(() => Project, {
        caption: 'פרוייקט',
        validate: (row, col) => {
            if (!col?.value) {
                col.error = terms.requiredField
            }
        }
    })
    project!: Project
    @Field(() => Complex, {
        caption: 'מתחם',
        validate: (row, col) => {
            if (!col?.value) {
                col.error = terms.requiredField
            }
        }
    })
    complex!: Complex
    @Field(() => Building, {
        caption: 'בניין',
        validate: (row, col) => {
            if (!col?.value) {
                col.error = terms.requiredField
            }
        }
    })
    building!: Building
    @Field(() => Apartment, {
        caption: 'דירה',
        validate: (row, col) => {
            if (!col?.value) {
                col.error = terms.requiredField
            }
        }
    })
    apartment!: Apartment
    @Field(() => User, { caption: 'מפקח' })
    inspector!: User
    @Field(() => User, { caption: 'מומחה' })
    professional!: User
    @Field(() => User, { caption: 'מנהל עבודה' })
    workManager!: User
    @Field(() => User, { caption: 'קבלן משנה' })
    subContractor!: User

    @Field(() => User, {
        caption: 'דייר',
        validate: (row, col) => {
            if (!col?.value) {
                col.error = terms.requiredField
            }
        }
    })
    tenant!: User

    @DataControl({ width: '108' })
    @Fields.dateOnly({
        caption: 'תאריך פנייה',
        validate: (row, col) => {
            if (!col?.value) {
                col.error = terms.requiredField
            }
        }
    })
    date!: Date

    @DataControl({ width: '98' })
    @Field(() => Space, { caption: 'חלל' })
    space!: Space

    @DataControl({ width: '98' })
    @Field(() => Category, {
        caption: 'מחלקה',
        validate: (row, col) => {
            if (!col?.value) {
                col.error = terms.requiredField
            }
        }
    })
    category!: Category

    @DataControl({ width: '98' })
    @Fields.string({ caption: 'שעת פנייה', inputType: 'time' })
    time = ''

    @DataControl({ width: '98' })
    @Field(() => RequestStatus)
    status = RequestStatus.open

    @Fields.string({
        caption: 'תיאור הליקוי',
        validate: (row, col) => {
            if (!col?.value) {
                col.error = terms.requiredField
            }
        }
    })
    description = ''

    @Fields.number({ caption: 'מס.עובדים' })
    workerCount!:number// = 0

    @Fields.number({ caption: 'מס.שעות' })
    workHours!:number// = 0

    @Fields.string({
        caption: 'תיאור הטיפול',
        validate: (row, col) => {
            if (!col?.value) {
                col.error = terms.requiredField
            }
        }
    })
    workDescription = ''

}
