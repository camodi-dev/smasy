import { Button } from "@/components/ui/button";
import { Link, usePage } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { School } from "lucide-react";
import type { AppPageProps } from "@/types/page";

interface ErrorLayoutProps {
    code: number;
    title: string;
    description: string;
    icon: React.ReactNode;
}

export default function ErrorLayout({ code, title, description, icon }: ErrorLayoutProps) {
    const { props } = usePage();
    const pageProps = props as AppPageProps;
    const isAuthenticated = Boolean(pageProps.auth?.user);

    const content = (
        <div className="w-full max-w-md text-center space-y-8">

            {/* Brand */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground shadow-lg">
                <School className="w-6 h-6" />
            </div>

            {/* Error Icon */}
            <div className="flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
                    {icon}
                </div>
            </div>

            {/* Error Code */}
            <div className="space-y-2">
                <h1 className="text-8xl font-black text-foreground/10 leading-none">
                    {code}
                </h1>
                <h2 className="text-2xl font-bold text-foreground -mt-4">
                    {title}
                </h2>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    {description}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={() => window.history.back()}>
                    Go Back
                </Button>
                <Button asChild>
                    <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                        {isAuthenticated ? "Go to Dashboard" : "Go to Login"}
                    </Link>
                </Button>
            </div>
        </div>
    );

    if (isAuthenticated) {
        return (
            <DashboardLayout>
                <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
                    {content}
                </div>
            </DashboardLayout>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-destructive/5 via-background to-background" />
            </div>

            {content}
        </div>
    );
}