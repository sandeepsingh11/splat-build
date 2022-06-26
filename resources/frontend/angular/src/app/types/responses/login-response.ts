import { User } from "../user";

export interface LoginResponse {
    error?: string,
    success?: string,
    userData?: User
}
