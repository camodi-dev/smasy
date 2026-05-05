export interface AppUser {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
}

export interface AppNotification {
    id: number;
    title: string;
    content: string;
    target_role: string;
    published_at?: string | null;
    created_at?: string | null;
    is_read: boolean;
}

export interface AppPageProps {
    auth?: {
        user?: AppUser | null;
    };
    notifications?: {
        unread_count: number;
        items: AppNotification[];
    };
}
