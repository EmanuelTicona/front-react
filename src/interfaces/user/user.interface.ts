export interface User {
    email?: string
    name?: string
    full_name?: string
    surname?: string
    two_factor?: boolean
    repo_login?: boolean
    message?: string
    status?: boolean
    user_github?: string
}

export interface UserResponse {
    token: string
    user: string
    name: string
}