export interface User {
    id: string;
    name: string;
    email: string;
    profile_photo?: string;
    country?: string;
    state?: string;
    city?: string; 
    created_at: string;
    updated_at: string;
}