import EntityCrud from "@/components/admin/EntityCrud";

interface AttendanceRow {
    id: number;
    student_id: number;
    timetable_slot_id: number;
    date: string;
    status: string;
    note: string | null;
    student: string;
    slot: string;
}

export default function Attendance({ attendances, students, slots }: any) {
    const rows = {
        ...attendances,
        data: attendances.data.map((attendance: any) => ({
            id: attendance.id,
            student_id: attendance.student_id,
            timetable_slot_id: attendance.timetable_slot_id,
            date: attendance.date,
            status: attendance.status,
            note: attendance.note ?? "",
            student: `${attendance.student?.first_name ?? ""} ${attendance.student?.last_name ?? ""}`.trim(),
            slot: `${attendance.timetable_slot?.course?.code ?? ""} ${attendance.timetable_slot?.day_of_week ?? ""}`.trim(),
        })),
    };

    return (
        <EntityCrud<AttendanceRow>
            title="Attendance"
            description="Track student attendance records."
            routeBase="/admin/attendance"
            searchPlaceholder="Search attendance..."
            records={rows}
            columns={[
                { key: "student", label: "Student" },
                { key: "slot", label: "Slot" },
                { key: "date", label: "Date" },
                { key: "status", label: "Status" },
            ]}
            fields={[
                { name: "student_id", label: "Student", type: "select", options: students.map((s: any) => ({ value: String(s.id), label: `${s.first_name} ${s.last_name} (${s.matricule ?? "N/A"})` })), required: true },
                { name: "timetable_slot_id", label: "Timetable Slot", type: "select", options: slots.map((slot: any) => ({ value: String(slot.id), label: `${slot.course?.code ?? ""} - ${slot.day_of_week} ${slot.start_time?.slice(0, 5)}` })), required: true },
                { name: "date", label: "Date", type: "date", required: true },
                { name: "status", label: "Status", type: "select", options: [
                    { value: "present", label: "Present" },
                    { value: "absent", label: "Absent" },
                    { value: "late", label: "Late" },
                    { value: "excused", label: "Excused" },
                ], required: true },
                { name: "note", label: "Note", type: "text" },
            ]}
        />
    );
}
