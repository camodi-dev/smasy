import EntityCrud from "@/components/admin/EntityCrud";

interface TeacherRow {
    id: number;
    user_id: number;
    employee_id: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    specialization: string | null;
    status: string;
    full_name: string;
}

export default function Teachers({ teachers, users, filters }: any) {
    const rows = {
        ...teachers,
        data: teachers.data.map((teacher: any) => ({
            id: teacher.id,
            user_id: teacher.user_id,
            employee_id: teacher.employee_id,
            first_name: teacher.first_name ?? "",
            last_name: teacher.last_name ?? "",
            phone: teacher.phone ?? "",
            specialization: teacher.specialization ?? "",
            status: teacher.status,
            full_name: `${teacher.first_name ?? ""} ${teacher.last_name ?? ""}`.trim(),
        })),
    };

    return (
        <EntityCrud<TeacherRow>
            title="Teachers"
            description="Manage teacher profiles and assignments."
            routeBase="/admin/teachers"
            searchPlaceholder="Search teachers..."
            records={rows}
            filters={filters}
            columns={[
                { key: "full_name", label: "Name" },
                { key: "employee_id", label: "Employee ID" },
                { key: "specialization", label: "Specialization" },
                { key: "status", label: "Status" },
            ]}
            fields={[
                { name: "user_id", label: "User", type: "select", options: users.map((u: any) => ({ value: String(u.id), label: `${u.name} (${u.email})` })), required: true },
                { name: "employee_id", label: "Employee ID", type: "text", required: true },
                { name: "first_name", label: "First Name", type: "text", required: true },
                { name: "last_name", label: "Last Name", type: "text", required: true },
                { name: "phone", label: "Phone", type: "text" },
                { name: "specialization", label: "Specialization", type: "text" },
                { name: "status", label: "Status", type: "select", options: [
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                    { value: "on_leave", label: "On Leave" },
                ], required: true },
            ]}
        />
    );
}
