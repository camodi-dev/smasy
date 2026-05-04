import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, CreditCard, ClipboardList, Award } from "lucide-react";
import { usePage } from "@inertiajs/react";

const adminStats = [
    { title: "Total Students", value: "1,234", icon: GraduationCap, change: "+12%" },
    { title: "Total Teachers", value: "48", icon: Users, change: "+3%" },
    { title: "Active Courses", value: "24", icon: BookOpen, change: "+5%" },
    { title: "Fees Collected", value: "$48,295", icon: CreditCard, change: "+8%" },
];

const teacherStats = [
    { title: "My Courses", value: "6", icon: BookOpen, change: "+1%" },
    { title: "My Students", value: "142", icon: GraduationCap, change: "+5%" },
    { title: "Attendance Rate", value: "94%", icon: ClipboardList, change: "+2%" },
    { title: "Avg Grade", value: "B+", icon: Award, change: "+0.5%" },
];

const studentStats = [
    { title: "Enrolled Courses", value: "6", icon: BookOpen, change: "" },
    { title: "Attendance Rate", value: "89%", icon: ClipboardList, change: "-1%" },
    { title: "Current Grade", value: "A-", icon: Award, change: "+5%" },
    { title: "Fees Due", value: "$500", icon: CreditCard, change: "" },
];

export default function Dashboard() {
    const { props } = usePage<{ auth: { user: any } }>();
    const role = props.auth?.user?.role;

    const stats =
        role === "admin"   ? adminStats   :
        role === "teacher" ? teacherStats :
                             studentStats;

    const greeting =
        role === "admin"   ? "Admin Overview" :
        role === "teacher" ? "Teaching Overview" :
                             "My Academic Overview";

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{greeting}</h1>
                    <p className="text-muted-foreground">Here's what's happening today</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </CardTitle>
                                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                                        <Icon className="w-4 h-4 text-primary" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    {stat.change && (
                                        <p className={`text-xs mt-1 ${
                                            stat.change.startsWith("-")
                                                ? "text-destructive"
                                                : "text-green-600"
                                        }`}>
                                            {stat.change} from last month
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

            </div>
        </DashboardLayout>
    );
}