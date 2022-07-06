import { ValueListFieldType } from "remult";

@ValueListFieldType({ caption: 'סטטוס' })
export class RequestStatus {
    static open = new RequestStatus('פתוח')
    static inProgress = new RequestStatus('בעבודה')
    static close = new RequestStatus('סגור')
    constructor(public caption = '') { }
    id!: string
}