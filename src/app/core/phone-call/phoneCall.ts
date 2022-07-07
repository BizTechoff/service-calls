import { Allow, Entity, Field, Fields, IdEntity } from "remult";
import { User } from "../../users/user";

@Entity<PhoneCall>('calls', (options, remult) => {
    options.allowApiCrud = Allow.authenticated
    options.caption = 'שיחה'
})
export class PhoneCall extends IdEntity {

    @Field(() => User, { caption: 'דייר' })
    tenant!: User

    @Fields.string({ caption: 'תוכן שיחה' })
    content = ''

    @Fields.string({ caption: 'הערה' })
    remark = ''

}
