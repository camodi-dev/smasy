import EntityCrud from "@/components/admin/EntityCrud";

interface SlotRow {
    id: number;
    course_id: number;
    teacher_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    room: string | null;
    academic_year: string;
    course: string;
    teacher: string;
}

export default function Timetable({ slots, courses, teachers }: any) {
    const rows = {
        ...slots,
        data: slots.data.map((slot: any) => ({
            id: slot.id,
            course_id: slot.course_id,
            teacher_id: slot.teacher_id,
            day_of_week: slot.day_of_week,
            start_time: slot.start_time?.slice(0, 5) ?? "",
            end_time: slot.end_time?.slice(0, 5) ?? "",
            room: slot.room ?? "",
            academic_year: slot.academic_year,
            course: slot.course?.name ?? "—",
            teacher: `${slot.teacher?.first_name ?? ""} ${slot.teacher?.last_name ?? ""}`.trim(),
        })),
    };

    return (
        <EntityCrud<SlotRow>
            title="Timetable"
            description="Plan and manage timetable slots."
            routeBase="/admin/timetable"
            searchPlaceholder="Search timetable..."
            records={rows}
            columns={[
                { key: "course", label: "Course" },
                { key: "teacher", label: "Teacher" },
                { key: "day_of_week", label: "Day" },
                { key: "academic_year", label: "Academic Year" },
            ]}
            fields={[
                { name: "course_id", label: "Course", type: "select", options: courses.map((c: any) => ({ value: String(c.id), label: `${c.name} (${c.code})` })), required: true },
                { name: "teacher_id", label: "Teacher", type: "select", options: teachers.map((t: any) => ({ value: String(t.id), label: `${t.first_name} ${t.last_name}` })), required: true },
                { name: "day_of_week", label: "Day", type: "select", options: ["monday","tuesday","wednesday","thursday","friday","saturday"].map((d) => ({ value: d, label: d })) , required: true },
                { name: "start_time", label: "Start Time", type: "time", required: true },
                { name: "end_time", label: "End Time", type: "time", required: true },
                { name: "room", label: "Room", type: "text" },
                { name: "academic_year", label: "Academic Year", type: "text", required: true },
            ]}
        />
    );
}
