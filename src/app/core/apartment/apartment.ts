import { Allow, Entity, Field, Fields, IdEntity } from "remult";
import { User } from "../../users/user";
import { Building } from "../building/building";
import { Project } from "../project/project";

@Entity('apartments', (options, remult) => {
    options.caption = 'בניין'
    options.allowApiCrud = Allow.authenticated
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

}
