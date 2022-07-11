import { Allow, Entity, Field, Fields } from "remult";
import { Request } from "./request";

@Entity('requestsHistory', (options, remult) => {
    options.allowApiCrud = Allow.authenticated
})
export class RequestHistory extends Request {

    @Fields.string()
    originId=''

}
