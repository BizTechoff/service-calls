import { Allow, Entity, Fields, IdEntity, Validators } from "remult";
import { terms } from "../../terms";

@Entity('projects', (options, remult) => {
    options.caption = 'פרויקט'
    options.allowApiCrud = Allow.authenticated
})
export class Project extends IdEntity {

    @Fields.string({
        caption: 'שם פרוייקט',
        //(row, col) => 
        validate: [
            Validators.required.withMessage(terms.requiredField),
            Validators.uniqueOnBackend.withMessage(terms.uniqueField)]
    })
    name = ''

    @Fields.string({ caption: 'כתובת' })
    address = ''

}
