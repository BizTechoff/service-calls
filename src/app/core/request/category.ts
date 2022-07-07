import { ValueListFieldType } from "remult";

@ValueListFieldType({ caption: 'מחלקה' })
export class Category {
    static electric = new Category('חשמל')
    static water = new Category('מים')
    static floor = new Category('רצפה')
    constructor(public caption = '') { }
    id!: string
}