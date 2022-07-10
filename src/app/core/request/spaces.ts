import { ValueListFieldType } from "remult";

@ValueListFieldType({ caption: 'חלל' })
export class Space {
    static room = new Space('חדר')
    static bathroom = new Space('מקלחת')
    static livingroom = new Space('סלון')
    static kitchen = new Space('מטבח')
    constructor(public caption = '') { }
    id!: string
}
