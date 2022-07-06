import { Allow, Entity, Field, Fields, IdEntity } from "remult";
import { User } from "../../users/user";

@Entity('requests', (options, remult) => {
    options.caption = 'פנייה'
    options.allowApiCrud = Allow.authenticated
})
export class Request extends IdEntity {

    @Field(() => User, { caption: 'דייר' })
    tenant!: User

    @Fields.dateOnly({ caption: 'תאריך פנייה' })
    date!: Date

    @Fields.string({ caption: 'שעת פנייה', inputType: 'time' })
    time = ''

}
