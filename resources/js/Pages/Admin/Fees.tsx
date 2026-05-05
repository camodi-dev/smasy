import EntityCrud from "@/components/admin/EntityCrud";

interface FeeRow {
    id: number;
    student_id: number;
    academic_year: string;
    semester: string;
    amount: number;
    paid: number;
    balance: number;
    status: string;
    due_date: string | null;
    paid_date: string | null;
    student: string;
}

export default function Fees({ fees, students }: any) {
    const rows = {
        ...fees,
        data: fees.data.map((fee: any) => ({
            id: fee.id,
            student_id: fee.student_id,
            academic_year: fee.academic_year,
            semester: fee.semester,
            amount: fee.amount,
            paid: fee.paid,
            balance: fee.balance,
            status: fee.status,
            due_date: fee.due_date ?? "",
            paid_date: fee.paid_date ?? "",
            student: `${fee.student?.first_name ?? ""} ${fee.student?.last_name ?? ""}`.trim(),
        })),
    };

    return (
        <EntityCrud<FeeRow>
            title="Fees"
            description="Manage student fee payment records."
            routeBase="/admin/fees"
            searchPlaceholder="Search fee records..."
            records={rows}
            columns={[
                { key: "student", label: "Student" },
                { key: "amount", label: "Amount" },
                { key: "paid", label: "Paid" },
                { key: "status", label: "Status" },
            ]}
            fields={[
                { name: "student_id", label: "Student", type: "select", options: students.map((s: any) => ({ value: String(s.id), label: `${s.first_name} ${s.last_name}` })), required: true },
                { name: "academic_year", label: "Academic Year", type: "text", required: true },
                { name: "semester", label: "Semester", type: "text", required: true },
                { name: "amount", label: "Amount", type: "number", required: true },
                { name: "paid", label: "Paid", type: "number", required: true },
                { name: "status", label: "Status", type: "select", options: [
                    { value: "pending", label: "Pending" },
                    { value: "partial", label: "Partial" },
                    { value: "paid", label: "Paid" },
                    { value: "overdue", label: "Overdue" },
                ], required: true },
                { name: "due_date", label: "Due Date", type: "date" },
                { name: "paid_date", label: "Paid Date", type: "date" },
            ]}
        />
    );
}
