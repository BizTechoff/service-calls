import { Allow, Entity, Fields, IdEntity, Validators } from "remult";
import { terms } from "../terms";

@Entity('photos', (options, remult) => {
    options.allowApiCrud = Allow.authenticated
})
export class Photo extends IdEntity {

    @Fields.string({
        caption: 'שם תמונה',
        validate: [
            Validators.required.withMessage(terms.requiredField),
            Validators.uniqueOnBackend.withMessage(terms.uniqueField)]
    })
    name = ''

    @Fields.string({
        caption: 'לינק',
        validate: Validators.required.withMessage(terms.requiredField)
    })
    link = ''

}
