import { Allow, Entity, Field, Fields, IdEntity } from "remult";
import { Complex } from "../complex/complex";
import { Project } from "../project/project";

@Entity('buildings', (options, remult) => {
    options.caption = 'בניין'
    options.allowApiCrud = Allow.authenticated
})
export class Building extends IdEntity {

    @Field(() => Complex, { caption: 'מתחם' })
    complex!: Complex

    @Fields.string({ caption: 'שם בניין' })
    name = ''

    @Fields.string({ caption: 'שם פנימי' })
    innerName = ''

}
