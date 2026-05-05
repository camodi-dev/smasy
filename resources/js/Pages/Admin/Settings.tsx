import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { router, useForm, usePage } from "@inertiajs/react";

interface User {
    id: number;
    name: string;
    email: string;
}

interface FlashProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Settings({ user }: { user: User }) {
    const { props } = usePage();
    const pageProps = props as FlashProps;
    const flash = pageProps.flash;

    const form = useForm({
        name: user.name ?? "",
        email: user.email ?? "",
        password: "",
        password_confirmation: "",
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.put("/profile");
    }

    function logout() {
        router.post("/logout");
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-2xl">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Settings & Profile</h1>
                    <p className="text-muted-foreground">Update your account details and security.</p>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                        {flash.error}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={submit}>
                            <div className="space-y-1.5">
                                <Label>Name</Label>
                                <Input value={form.data.name} onChange={(e) => form.setData("name", e.target.value)} />
                                {form.errors.name && <p className="text-xs text-destructive">{form.errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Email</Label>
                                <Input type="email" value={form.data.email} onChange={(e) => form.setData("email", e.target.value)} />
                                {form.errors.email && <p className="text-xs text-destructive">{form.errors.email}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>New Password (optional)</Label>
                                <Input type="password" value={form.data.password} onChange={(e) => form.setData("password", e.target.value)} />
                                {form.errors.password && <p className="text-xs text-destructive">{form.errors.password}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Confirm New Password</Label>
                                <Input type="password" value={form.data.password_confirmation} onChange={(e) => form.setData("password_confirmation", e.target.value)} />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={form.processing}>
                                    {form.processing ? "Saving..." : "Save Settings"}
                                </Button>
                                <Button type="button" variant="destructive" onClick={logout}>
                                    Logout
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
