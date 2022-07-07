import { Allow, Entity, Field, Fields, IdEntity, isBackend } from "remult";
import { terms } from "../../terms";
import { User } from "../../users/user";
import { Building } from "../building/building";

@Entity<Apartment>('apartments', (options, remult) => {
    options.caption = 'בניין'
    options.allowApiCrud = Allow.authenticated
    options.deleting = async (row) => {
        if (isBackend()) {
            if (row.isPublic()) {
                let count = await remult.repo(Apartment).count({ building: row.building })
                if (count > 1) {
                    throw 'לא ניתן למחוק קבוצה ציבורית'
                }//todo: if create new apartment for current building need created public again
            }
        }
    }
})
export class Apartment extends IdEntity {

    // @Field(() => Project, { caption: 'פרויקט' })
    // project!: Project

    @Field(() => Building, { caption: 'בניין' })
    building!: Building

    @Field(() => User, { caption: 'דייר' })
    tenant?: User

    @Fields.string({ caption: 'מס. דירה' })
    number = ''

    @Fields.number({ caption: 'קומה' })
    floor = ''

    @Fields.string({ caption: 'שם פנימי' })
    innerName = ''

    isPublic() {
        return this.innerName?.trim() === terms.public
    }

}
