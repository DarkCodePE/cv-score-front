// types/user.ts

export interface User {
    userId: string;
    username: string;           // Cambiado de name a username para coincidir con Spring
    email: string;
    roles: string[];           // Nuevo campo para roles
    group_id?: string;
    session_id: string;
    chat_status?: string;
    last_login?: string;       // Nuevo campo para tracking del último login
    created_at?: string;
    updated_at?: string;
}

// Interfaz para la respuesta de autenticación
export interface AuthResponse {
    token: string;
    userId: string;
    username: string;           // Cambiado de name a username para coincidir con Spring
    email: string;
    roles: string[];           // Nuevo campo para roles
    group_id?: string;
    session_id: string;
    chat_status?: string;
    last_login?: string;       // Nuevo campo para tracking del último login
    created_at?: string;
    updated_at?: string;
}

// Interfaz para el login
export interface LoginRequest {
    identifier: string;          // username o email
    password: string;
}

// Interfaz para el registro
export interface RegisterRequest {
    username: string;          // Cambiado de name a username
    email: string;
    password: string;
}

// Interfaz para la respuesta del usuario con token
export interface UserResponse extends User {
    token: string;            // Incluye el token JWT
}

// Interfaz para la creación de usuario (si aún se necesita)
export interface UserCreate {
    username: string;         // Cambiado de name a username
    group_id: string;
}

export interface Course {
    id: string;
    name: string;
    google_drive_folder_id: string;
    created_at?: string;
    updated_at?: string;
    users?: User[];
}

export interface UserResponse extends User {}

export interface UserCreate {
    name: string;
    group_id: string;
}

// Interfaz para los claims del token JWT
export interface JWTClaims {
    sub: string;              // username
    roles: string[];
    user_id: string;
    courseIds?: string[];
    exp: number;              // timestamp de expiración
}

// Interfaz para el estado de autenticación
export interface AuthState {
    user: User | null;
    token: string | null;
}

export interface LoginFormData {
    identifier: string;
    username: string;
    email: string;
    password: string;
}