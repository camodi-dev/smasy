import EntityCrud from "@/components/admin/EntityCrud";

interface CourseRow {
    id: number;
    department_id: number;
    name: string;
    code: string;
    credits: number;
    semester: string | null;
    level: string | null;
    description: string | null;
    status: string;
    department: string;
}

export default function Courses({ courses, departments, filters }: any) {
    const rows = {
        ...courses,
        data: courses.data.map((course: any) => ({
            id: course.id,
            department_id: course.department_id,
            name: course.name,
            code: course.code,
            credits: course.credits,
            semester: course.semester ?? "",
            level: course.level ?? "",
            description: course.description ?? "",
            status: course.status,
            department: course.department?.name ?? "—",
        })),
    };

    return (
        <EntityCrud<CourseRow>
            title="Courses"
            description="Create and manage course offerings."
            routeBase="/admin/courses"
            searchPlaceholder="Search courses..."
            records={rows}
            filters={filters}
            columns={[
                { key: "name", label: "Name" },
                { key: "code", label: "Code" },
                { key: "department", label: "Department" },
                { key: "status", label: "Status" },
            ]}
            fields={[
                { name: "department_id", label: "Department", type: "select", options: departments.map((d: any) => ({ value: String(d.id), label: `${d.name} (${d.code})` })), required: true },
                { name: "name", label: "Name", type: "text", required: true },
                { name: "code", label: "Code", type: "text", required: true },
                { name: "credits", label: "Credits", type: "number", required: true },
                { name: "semester", label: "Semester", type: "text" },
                { name: "level", label: "Level", type: "text" },
                { name: "description", label: "Description", type: "textarea" },
                { name: "status", label: "Status", type: "select", options: [
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                ], required: true },
            ]}
        />
    );
}
