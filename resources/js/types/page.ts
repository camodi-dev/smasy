export interface AppUser {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
}

export interface AppPageProps {
    auth?: {
        user?: AppUser | null;
    };
}
