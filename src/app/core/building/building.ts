import { Allow, BackendMethod, Entity, Field, Fields, IdEntity, isBackend, Remult } from "remult";
import { terms } from "../../terms";
import { Apartment } from "../apartment/apartment";
import { Complex } from "../complex/complex";

@Entity<Building>('buildings', (options, remult) => {
    options.caption = 'בניין'
    options.allowApiCrud = Allow.authenticated
    options.saved = async (row) => {
        if (isBackend()) {
            if (row.isNew()) {
                await row.createPublic(row.id)
            }
            else {
                let count = await remult.repo(Apartment).findFirst({ building: row })
                if (!count) {
                    await row.createPublic(row.id)
                }
            }
        }
    }
})
export class Building extends IdEntity {

    @Field(() => Apartment, {caption: 'ציבורי'})
    self!: Apartment// ציבורי - חדר מדרגות, לובי, מקלט, מחסנים, פיתוח

    @Field(() => Complex, {
        caption: 'מתחם',
        displayValue: (row, col) => col?.$.name?.value
    })
    complex!: Complex

    @Fields.string({ caption: 'שם בניין' })
    name = ''

    @Fields.string({ caption: 'שם פנימי' })
    innerName = ''

    // @Fields.object<Apartment[]>()
    apartments: Apartment[] = [] as Apartment[]

    isPublic() {
        return this.innerName === terms.public
    }

    @BackendMethod({ allowed: Allow.authenticated })
    async createPublic(bid: string, remult?: Remult) {
        // bid = this.id
        if (bid?.trim().length) {
            bid = bid.trim()
            let b = await remult!.repo(Building).findId(bid)
            if (b) {
                let a = remult!.repo(Apartment).create()
                a.innerName = terms.public
                a.building = b
                await a.save()
            }
        }
    }
}


// let createOnlyIfNew = false
// if (createOnlyIfNew) {
//     if (!row.isNew()) {
//         return
//     }
// }

// let checkIfExists = false
// if (checkIfExists) {
//     let exists = await remult.repo(Apartment).findFirst(
//         { building: row, innerName: terms.public });
//     if (exists) {
//         return
//     }
// }
// if (row.isNew()) {
//     await row.createPublic(row.id)
// }
