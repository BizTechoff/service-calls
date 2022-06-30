import { Allow, Entity, Field, IdEntity } from "remult";
import { User } from "../../users/user";

@Entity('requests', (options, remult) => {
    options.caption = 'פנייה'
    options.allowApiCrud = Allow.authenticated
})
export class Request extends IdEntity {

    @Field(() => User, { caption: 'דייר' })
    tenant!: User

}
