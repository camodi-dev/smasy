import EntityCrud from "@/components/admin/EntityCrud";

interface GradeRow {
    id: number;
    student_id: number;
    enrollment_id: number;
    exam_id: number;
    score: number;
    max_score: number;
    grade_letter: string | null;
    remarks: string | null;
    student: string;
    exam: string;
}

export default function Grades({ grades, students, exams, enrollments }: any) {
    const rows = {
        ...grades,
        data: grades.data.map((grade: any) => ({
            id: grade.id,
            student_id: grade.student_id,
            enrollment_id: grade.enrollment_id,
            exam_id: grade.exam_id,
            score: grade.score,
            max_score: grade.max_score,
            grade_letter: grade.grade_letter ?? "",
            remarks: grade.remarks ?? "",
            student: `${grade.student?.first_name ?? ""} ${grade.student?.last_name ?? ""}`.trim(),
            exam: grade.exam?.title ?? "—",
        })),
    };

    return (
        <EntityCrud<GradeRow>
            title="Grades"
            description="Manage student grades and score records."
            routeBase="/admin/grades"
            searchPlaceholder="Search grades..."
            records={rows}
            columns={[
                { key: "student", label: "Student" },
                { key: "exam", label: "Exam" },
                { key: "score", label: "Score" },
                { key: "grade_letter", label: "Grade" },
            ]}
            fields={[
                { name: "student_id", label: "Student", type: "select", options: students.map((s: any) => ({ value: String(s.id), label: `${s.first_name} ${s.last_name}` })), required: true },
                { name: "enrollment_id", label: "Enrollment", type: "select", options: enrollments.map((e: any) => ({ value: String(e.id), label: `${e.course?.code ?? ""} - ${e.academic_year} ${e.semester}` })), required: true },
                { name: "exam_id", label: "Exam", type: "select", options: exams.map((e: any) => ({ value: String(e.id), label: `${e.title} (${e.course?.code ?? ""})` })), required: true },
                { name: "score", label: "Score", type: "number", required: true },
                { name: "max_score", label: "Max Score", type: "number", required: true },
                { name: "grade_letter", label: "Grade Letter", type: "text" },
                { name: "remarks", label: "Remarks", type: "text" },
            ]}
        />
    );
}
