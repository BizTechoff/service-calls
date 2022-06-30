import { Allow, Entity, Fields, IdEntity } from "remult";

@Entity('projects', (options, remult) => {
    options.caption = 'פרויקט'
    options.allowApiCrud = Allow.authenticated
})
export class Project extends IdEntity {

    @Fields.string({ caption: 'שם פרוייקט' })
    name = ''

    @Fields.string({ caption: 'כתובת' })
    address = ''

}
