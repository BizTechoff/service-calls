import { Allow, Entity, Field, Fields, IdEntity } from "remult";
import { Complex } from "../complex/complex";

@Entity('buildings', (options, remult) => {
    options.caption = 'בניין'
    options.allowApiCrud = Allow.authenticated
})
export class Building extends IdEntity {

    @Field(() => Complex, {
        caption: 'מתחם',
        displayValue: (row, col) => col?.$.name?.value
    })
    complex!: Complex

    @Fields.string({ caption: 'שם בניין' })
    name = ''

    @Fields.string({ caption: 'שם פנימי' })
    innerName = ''

}
