import { Injectable } from "@angular/core";
import { Allow, BackendMethod, ControllerBase } from "remult";
import { User } from "../users/user";
import { Apartment } from "./apartment/apartment";
import { Project } from "./project/project";

@Injectable()
export class Usher extends ControllerBase {

    @BackendMethod({ allowed: Allow.authenticated })
    async assignTenant2Apartment(tid: string, aid: string) {
        let tenant = await this.remult.repo(User).findId(tid, { useCache: false })
        let apartment = await this.remult.repo(Apartment).findId(aid, { useCache: false })
    }

    @BackendMethod({ allowed: Allow.authenticated })
    async assignProjectManager2Project(uid: string, pid: string) {
        let manager = await this.remult.repo(User).findId(uid, { useCache: false })
        let project = await this.remult.repo(Project).findId(pid, { useCache: false })
    }

}
