import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    LayoutDashboard, Users, GraduationCap, BookOpen, Calendar,
    ClipboardList, Award, CreditCard, Megaphone, Settings, ChevronLeft, School
} from "lucide-react";

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
}

interface NavGroup {
    label: string;
    items: NavItem[];
}

const adminNavigation: NavGroup[] = [
    {
        label: "Overview",
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ]
    },
    {
        label: "Academic",
        items: [
            { name: "Students", href: "/admin/students", icon: GraduationCap },
            { name: "Teachers", href: "/admin/teachers", icon: Users },
            { name: "Courses", href: "/admin/courses", icon: BookOpen },
            { name: "Timetable", href: "/admin/timetable", icon: Calendar },
            { name: "Attendance", href: "/admin/attendance", icon: ClipboardList },
            { name: "Grades", href: "/admin/grades", icon: Award },
        ]
    },
    {
        label: "Finance",
        items: [
            { name: "Fees", href: "/admin/fees", icon: CreditCard },
        ]
    },
    {
        label: "Communication",
        items: [
            { name: "Announcements", href: "/admin/announcements", icon: Megaphone, badge: "3" },
        ]
    },
    {
        label: "System",
        items: [
            { name: "Settings", href: "/admin/settings", icon: Settings },
        ]
    },
];

const teacherNavigation: NavGroup[] = [
    {
        label: "Overview",
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ]
    },
    {
        label: "My Classes",
        items: [
            { name: "My Courses", href: "/teacher/courses", icon: BookOpen },
            { name: "My Students", href: "/teacher/students", icon: GraduationCap },
            { name: "Timetable", href: "/teacher/timetable", icon: Calendar },
        ]
    },
    {
        label: "Academic",
        items: [
            { name: "Attendance", href: "/teacher/attendance", icon: ClipboardList },
            { name: "Grades", href: "/teacher/grades", icon: Award },
            { name: "Exams", href: "/teacher/exams", icon: BookOpen },
        ]
    },
    {
        label: "Communication",
        items: [
            { name: "Announcements", href: "/teacher/announcements", icon: Megaphone },
        ]
    },
];

const studentNavigation: NavGroup[] = [
    {
        label: "Overview",
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ]
    },
    {
        label: "Academic",
        items: [
            { name: "My Courses", href: "/student/courses", icon: BookOpen },
            { name: "Timetable", href: "/student/timetable", icon: Calendar },
            { name: "Attendance", href: "/student/attendance", icon: ClipboardList },
            { name: "Grades", href: "/student/grades", icon: Award },
            { name: "Exams", href: "/student/exams", icon: BookOpen },
        ]
    },
    {
        label: "Finance",
        items: [
            { name: "Fees", href: "/student/fees", icon: CreditCard },
        ]
    },
    {
        label: "Communication",
        items: [
            { name: "Announcements", href: "/student/announcements", icon: Megaphone },
        ]
    },
];

const navigationMap: Record<string, NavGroup[]> = {
    admin: adminNavigation,
    teacher: teacherNavigation,
    student: studentNavigation,
};

interface SidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, onCollapse }: SidebarProps) => {
    const { url, props } = usePage<{ auth: { user: any } }>();
    const role: string = props.auth?.user?.role ?? "student";
    const navigation = navigationMap[role] ?? studentNavigation;

    return (
        <TooltipProvider delayDuration={0}>
            <aside className={cn(
                "fixed left-0 top-0 z-30 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col",
                collapsed ? "w-16" : "w-64"
            )}>

                {/* Logo */}
                <div className="flex items-center h-16 px-4 border-b border-border">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                            <School className="w-4 h-4 text-primary-foreground" />
                        </div>
                        {!collapsed && (
                            <span className="font-bold text-foreground truncate">
                                Smasy
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
                    {navigation.map((group) => (
                        <div key={group.label}>
                            {!collapsed && (
                                <p className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {group.label}
                                </p>
                            )}
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = url.startsWith(item.href);
                                    const Icon = item.icon;

                                    return collapsed ? (
                                        <Tooltip key={item.name}>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "flex items-center justify-center w-full h-10 rounded-md transition-colors",
                                                        isActive
                                                            ? "bg-primary text-primary-foreground"
                                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                    )}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                {item.name}
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-2 h-10 rounded-md text-sm transition-colors",
                                                isActive
                                                    ? "bg-primary text-primary-foreground font-medium"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            )}
                                        >
                                            <Icon className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{item.name}</span>
                                            {item.badge && (
                                                <Badge className="ml-auto h-5 px-1.5 text-xs">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                            {!collapsed && <Separator className="mt-4" />}
                        </div>
                    ))}
                </nav>

                {/* Collapse Button */}
                <div className="p-2 border-t border-border">
                    <button
                        onClick={() => onCollapse(!collapsed)}
                        className="flex items-center justify-center w-full h-10 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <ChevronLeft className={cn(
                            "w-4 h-4 transition-transform duration-300",
                            collapsed && "rotate-180"
                        )} />
                    </button>
                </div>

            </aside>
        </TooltipProvider>
    );
}

export default Sidebar;