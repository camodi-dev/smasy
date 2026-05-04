import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { router } from "@inertiajs/react";
import { Eye, EyeOff, Loader2, School } from "lucide-react";
import { useState } from "react";

export default function Login() {
    const [loading, setLoading] = useState<'google' | 'credential' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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

        router.post('/login', { credential, password }, {
            onError: () => {
                setError('Invalid credentials. Please try again.');
                setLoading(null);
            },
            onFinish: () => setLoading(null),
        });
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">

            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
            </div>

            <div className="w-full max-w-md space-y-6">

                {/* Brand */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-lg">
                        <School className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Sign in to your Smasy account
                        </p>
                    </div>
                </div>

                {/* Card */}
                <Card className="shadow-lg border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Sign in</CardTitle>
                        <CardDescription>
                            Use your Google account or credentials
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        {/* Google Button */}
                        <Button
                            variant="outline"
                            className="w-full h-11 gap-3"
                            onClick={handleGoogleLogin}
                            disabled={loading !== null}
                        >
                            {loading === 'google' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                            )}
                            Continue with Google
                        </Button>

                        {/* Separator */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Credential Form */}
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="credential">Email or Matricule</Label>
                                <Input
                                    id="credential"
                                    type="text"
                                    placeholder="Enter your email or matricule"
                                    value={credential}
                                    onChange={(e) => setCredential(e.target.value)}
                                    disabled={loading !== null}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCredentialLogin()}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <a href="/forgot-password" className="text-xs text-primary hover:underline">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading !== null}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCredentialLogin()}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword
                                            ? <EyeOff className="w-4 h-4" />
                                            : <Eye className="w-4 h-4" />
                                        }
                                    </button>
                                </div>
                            </div>

                            <Button
                                className="w-full h-11"
                                onClick={handleCredentialLogin}
                                disabled={loading !== null || !credential || !password}
                            >
                                {loading === 'credential'
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : 'Sign in'
                                }
                            </Button>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive text-center">
                                {error}
                            </div>
                        )}

                        {/* Trust signal */}
                        <p className="text-center text-xs text-muted-foreground">
                            Secured by Firebase Authentication
                        </p>

                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground">
                    By continuing, you agree to our{" "}
                    <a href="#" className="underline underline-offset-4 hover:text-primary">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline underline-offset-4 hover:text-primary">
                        Privacy Policy
                    </a>
                    . &copy; {new Date().getFullYear()} Smasy.
                </p>

            </div>
        </div>
    );
}