import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { router } from "@inertiajs/react";
import { useState } from "react";

export default function Login() {
    const [loading, setLoading] = useState<'google' | 'credential' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [credential, setCredential] = useState(''); // Can be email or matricule
    const [password, setPassword] = useState('');

    async function handleGoogleLogin() {
        setError(null);
        setLoading('google');
        try {
            await window.loginWithGoogle();
        } catch (e: any) {
            setError(e.message);
            setLoading(null);
        }
    }

    async function handleCredentialLogin() {
        setError(null);
        setLoading('credential');
        if (!credential || !password) {
            setError('Please fill in all fields');
            setLoading(null);
            return;
        }

        const isEmail = credential.includes('@') && credential.includes('.');

        router.post('/login', {
            credential,
            password,
        }, {
            onError: () => {
                setError(isEmail ? 'Invalid email or password' : 'Invalid matricule or password');
            },
            onFinish: () => {
                setLoading(null);
            },
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-background/90 flex items-center justify-center p-4">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-transparent via-primary/10 to-transparent" />
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10">
                {/* Brand */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-3xl shadow-2xl">
                        S
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter text-foreground mb-2">
                        Welcome back to Smasy
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Sign in to your account to continue your journey
                    </p>
                </div>

                {/* Card */}
                <Card className="border-none shadow-xl">
                    <CardHeader className="space-y-3 pb-6">
                        <div className="flex flex-col items-center">
                            <CardTitle className="text-2xl font-bold text-center">
                                Sign in
                            </CardTitle>
                            <CardDescription className="text-center text-muted-foreground">
                                Choose your preferred sign in method
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Google Button */}
                        <Button
                            variant="outline"
                            className="w-full h-12 gap-4 border border-input/50 hover:border-primary/50 transition-all duration-200"
                            onClick={handleGoogleLogin}
                            disabled={loading !== null}
                        >
                            {loading === 'google' ? (
                                <div className="flex h-8 w-8 items-center justify-center">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                </div>
                            ) : (
                                <div className="flex items-center w-full justify-start">
                                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span className="ml-3 font-medium text-foreground">
                                        Continue with Google
                                    </span>
                                </div>
                            )}
                        </Button>

                        {/* Separator */}
                        {loading === null && (
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator className="border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                                    <span className="bg-background px-4 text-muted-foreground">
                                        Or sign in with
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Credential/Password Form */}
                        {loading !== 'credential' && (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Enter your email or matricule"
                                    value={credential}
                                    onChange={(e) => setCredential(e.target.value)}
                                    className="w-full px-5 py-3 border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                                    disabled={loading === 'credential'}
                                />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-3 border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                                    disabled={loading === 'credential'}
                                />
                                <Button
                                    variant="default"
                                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                                    onClick={handleCredentialLogin}
                                    disabled={loading !== null || !credential || !password}
                                >
                                    {loading === 'credential' ? (
                                        <div className="flex h-8 w-8 items-center justify-center">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                            </svg>
                                        </div>
                                    ) : (
                                        'Sign in'
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-6 py-4 text-sm text-destructive text-center">
                                {error}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center text-sm text-muted-foreground">
                    <p>
                        By continuing, you agree to our
                        <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                            Privacy Policy
                        </a>
                    </p>
                    <p className="mt-2 text-xs">
                        © {new Date().getFullYear()} Smasy. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}