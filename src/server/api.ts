import { config } from 'dotenv';
import { createPostgresConnection } from 'remult/postgres';
import { remultExpress } from 'remult/remult-express';
import { Apartment } from '../app/core/apartment/apartment';
import { Building } from '../app/core/building/building';
import { Complex } from '../app/core/complex/complex';
import { PhoneCall } from '../app/core/phone-call/phoneCall';
import { Project } from '../app/core/project/project';
import { Request } from '../app/core/request/request';
import { SignInController } from '../app/users/SignInController';
import { UpdatePasswordController } from '../app/users/UpdatePasswordController';
import { User } from '../app/users/user';

config()

export const api = remultExpress({
    entities: [User, Project, Complex, Building, Apartment, Request, PhoneCall],
    controllers: [SignInController, UpdatePasswordController],
    dataProvider: async () => {
        // if (process.env['NODE_ENV'] === "production")
        return createPostgresConnection({ configuration: "heroku", sslInDev: process.env['DEV_MODE'] === 'PROD' })
        // return undefined;
    }
});
