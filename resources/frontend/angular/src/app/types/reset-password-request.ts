export interface ResetPasswordRequest {
    token: string,
    email: string,
    password: string,
    password_confirmation: string
}