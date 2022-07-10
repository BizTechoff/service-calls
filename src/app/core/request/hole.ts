import { ValueListFieldType } from "remult";

@ValueListFieldType({ caption: 'חלל' })
export class Hole {
    static electric = new Hole('מסדרון')
    static water = new Hole('מטבח')
    static floor = new Hole('סלון')
    constructor(public caption = '') { }
    id!: string
}
