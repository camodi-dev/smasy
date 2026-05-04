import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background">

            {/* Sidebar */}
            <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

            {/* Main Content */}
            <div className={cn(
                "transition-all duration-300",
                collapsed ? "ml-16" : "ml-64"
            )}>
                {/* Navbar */}
                <Navbar collapsed={collapsed} />

                {/* Page Content */}
                <main className="pt-16 min-h-screen">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>

            <Toaster />
        </div>
    );
}