import EntityCrud from "@/components/admin/EntityCrud";

interface StudentRow {
    id: number;
    user_id: number | null;
    department_id: number | null;
    matricule: string | null;
    first_name: string;
    last_name: string;
    phone: string | null;
    level: string | null;
    year: string | null;
    status: string;
    full_name: string;
    department: string;
}

export default function Students({ students, departments, users, filters }: any) {
    const rows = {
        ...students,
        data: students.data.map((student: any) => ({
            id: student.id,
            user_id: student.user_id,
            department_id: student.department_id,
            matricule: student.matricule,
            first_name: student.first_name ?? "",
            last_name: student.last_name ?? "",
            phone: student.phone ?? "",
            level: student.level ?? "",
            year: student.year ?? "",
            status: student.status,
            full_name: `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim(),
            department: student.department?.name ?? "—",
        })),
    };

    return (
        <EntityCrud<StudentRow>
            title="Students"
            description="Manage student records and academic profiles."
            routeBase="/admin/students"
            searchPlaceholder="Search students..."
            records={rows}
            filters={filters}
            columns={[
                { key: "full_name", label: "Name" },
                { key: "matricule", label: "Matricule" },
                { key: "department", label: "Department" },
                { key: "status", label: "Status" },
            ]}
            fields={[
                { name: "user_id", label: "User", type: "select", options: users.map((u: any) => ({ value: String(u.id), label: `${u.name} (${u.email})` })) },
                { name: "department_id", label: "Department", type: "select", options: departments.map((d: any) => ({ value: String(d.id), label: `${d.name} (${d.code})` })) },
                { name: "matricule", label: "Matricule", type: "text" },
                { name: "first_name", label: "First Name", type: "text", required: true },
                { name: "last_name", label: "Last Name", type: "text", required: true },
                { name: "phone", label: "Phone", type: "text" },
                { name: "level", label: "Level", type: "text" },
                { name: "year", label: "Year", type: "text" },
                { name: "status", label: "Status", type: "select", options: [
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                    { value: "suspended", label: "Suspended" },
                    { value: "graduated", label: "Graduated" },
                ], required: true },
            ]}
        />
    );
}
