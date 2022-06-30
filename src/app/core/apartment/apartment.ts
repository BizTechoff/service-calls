import { Allow, Entity, Field, Fields, IdEntity } from "remult";
import { User } from "../../users/user";
import { Building } from "../building/building";

@Entity('apartments', (options, remult) => {
    options.caption = 'בניין'
    options.allowApiCrud = Allow.authenticated
})
export class Apartment extends IdEntity {

    @Field(() => Building, { caption: 'בניין' })
    building!: Building

    @Field(() => User, { caption: 'דייר' })
    tenant?: User

    @Fields.string({ caption: 'מס. דירה' })
    number = ''

    @Fields.string({ caption: 'שם פנימי' })
    innerName = ''

}
