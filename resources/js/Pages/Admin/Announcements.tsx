import EntityCrud from "@/components/admin/EntityCrud";

interface AnnouncementRow {
    id: number;
    title: string;
    content: string;
    target_role: string;
    published_at: string | null;
    expires_at: string | null;
    creator: string;
}

export default function Announcements({ announcements }: any) {
    const rows = {
        ...announcements,
        data: announcements.data.map((announcement: any) => ({
            id: announcement.id,
            title: announcement.title,
            content: announcement.content,
            target_role: announcement.target_role,
            published_at: announcement.published_at ? String(announcement.published_at).slice(0, 10) : "",
            expires_at: announcement.expires_at ? String(announcement.expires_at).slice(0, 10) : "",
            creator: announcement.creator?.name ?? "—",
        })),
    };

    return (
        <EntityCrud<AnnouncementRow>
            title="Announcements"
            description="Publish notices to users and classes."
            routeBase="/admin/announcements"
            searchPlaceholder="Search announcements..."
            records={rows}
            columns={[
                { key: "title", label: "Title" },
                { key: "target_role", label: "Target" },
                { key: "published_at", label: "Published" },
                { key: "creator", label: "Created By" },
            ]}
            fields={[
                { name: "title", label: "Title", type: "text", required: true },
                { name: "content", label: "Content", type: "textarea", required: true },
                { name: "target_role", label: "Target Role", type: "select", options: [
                    { value: "all", label: "All" },
                    { value: "admin", label: "Admin" },
                    { value: "teacher", label: "Teacher" },
                    { value: "student", label: "Student" },
                ], required: true },
                { name: "published_at", label: "Published At", type: "date" },
                { name: "expires_at", label: "Expires At", type: "date" },
            ]}
        />
    );
}
