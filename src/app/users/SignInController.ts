import jwt from 'jsonwebtoken';
import { BackendMethod, Controller, ControllerBase, Fields, UserInfo, Validators } from "remult";
import { terms } from "../terms";
import { Roles } from "./roles";
import { User } from "./user";

@Controller('signIn')
export class SignInController extends ControllerBase {
    @Fields.string({
        caption: terms.username,
        validate: Validators.required
    })
    user = '';
    @Fields.string({
        caption: terms.password,
        validate: Validators.required,
        inputType: 'password'
    })
    password = '';

    @Fields.boolean({
        caption: terms.rememberOnThisDevice,
    })
    rememberOnThisDevice = false;

    @BackendMethod({ allowed: true })
    async signIn() {
        let result: UserInfo;
        const userRepo = this.remult.repo(User);
        let u = await userRepo.findFirst({ name: this.user });
        if (!u) {
            if (await userRepo.count() === 0) { //first ever user is the admin
                u = await userRepo.insert({
                    name: this.user,
                    admin: true,
                    mobile: process.env['ADMIN_MOBILE']
                })
            }
        }
        if (u)
            if (!u.password) { // if the user has no password defined, the first password they use is their password
                u.hashAndSetPassword(this.password);
                await u.save();
            }

        if (await u.passwordMatches(this.password)) {
            result = {
                id: u.id,
                roles: [],
                name: u.name,
                isAdmin: false,
                isBedekManager: false,
                isBedek: false,
                isProfessional: false,
                isTenant: false,
                group: '',
                isBuildingManager: false,
                isInspector: false
            };
            if (u.admin) {
                result.roles.push(Roles.admin);
                result.isAdmin = true
                result.group = Roles.admin
            }
            else if (u.bedekManager) {
                result.roles.push(Roles.bedekManager);
                result.isBedekManager = true
                result.group = Roles.bedekManager
            }
            else if (u.bedek) {
                result.roles.push(Roles.bedek);
                result.isBedek = true
                result.group = Roles.bedek
            }
            else if (u.buildingManager) {
                result.roles.push(Roles.buildingManager);
                result.isBuildingManager = true
                result.group = Roles.buildingManager
            }
            else if (u.professional) {
                result.roles.push(Roles.professional);
                result.isProfessional = true
                result.group = Roles.professional
            }
            else if (u.tenant) {
                result.roles.push(Roles.tenant);
                result.isTenant = true
                result.group = Roles.tenant
            }
            else if (u.inspector) {
                result.roles.push(Roles.inspector);
                result.isInspector = true
                result.group = Roles.inspector
            }
        }

        if (result!) {
            return (jwt.sign(result, getJwtSecret()));
        }
        throw new Error(terms.invalidSignIn);
    }
}
export function getJwtSecret() {
    if (process.env['NODE_ENV'] === "production")
        return process.env['TOKEN_SIGN_KEY']!;
    return process.env['JWT_SECRET']!;
}
