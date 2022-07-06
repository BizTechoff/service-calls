import { Allow, Entity, Field, Fields, IdEntity } from "remult";
import { Project } from "../project/project";

@Entity('complexes', (options, remult) => {
    options.caption = 'מתחם'
    options.allowApiCrud = Allow.authenticated
})
export class Complex extends IdEntity {

    @Field(() => Project, {
        caption: 'פרויקט',
        displayValue: (row, col) => col?.$.name?.value
    })
    project!: Project

    @Fields.string({ caption: 'שם מתחם' })
    name = ''

}
