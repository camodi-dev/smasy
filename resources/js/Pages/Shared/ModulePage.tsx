import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePage, Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";

interface ModulePageProps {
    title?: string;
    description?: string;
}

export default function ModulePage() {
    const { props } = usePage();
    const pageProps = props as ModulePageProps;
    const title = pageProps.title ?? "Module";
    const description = pageProps.description ?? "This section is ready for your data integration.";

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Metrics and summary cards for this module can be shown here.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Records</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Data tables, filters, and actions for {title.toLowerCase()} will appear here.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                This interface is now connected and ready for backend features.
                            </p>
                            <Button asChild variant="outline" className="w-full justify-between">
                                <Link href="/dashboard">
                                    Back to Dashboard
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
