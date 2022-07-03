import { User } from "../user";

export interface LoginResponse {
    error?: string,
    success?: string,
    token?: string,
    userData?: User
}
