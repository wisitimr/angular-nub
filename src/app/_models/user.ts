import { Company } from "./company";

export class User {
    id?: string;
    username?: string;
    password?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    accessToken?: string;
    company?: Company;
}