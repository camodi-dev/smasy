import { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Menu, Bell, User, Settings, LogOut } from "lucide-react";
import Sidebar from "./Sidebar";
import type { AppPageProps } from "@/types/page";

interface NavbarProps {
    collapsed: boolean;
}

export default function Navbar({ collapsed }: NavbarProps) {
    const { props } = usePage();
    const pageProps = props as AppPageProps;
    const user = pageProps.auth?.user;

    const initials = user?.name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) ?? "U";

    function handleLogout() {
        router.post("/logout");
    }

    return (
        <header className="fixed top-0 right-0 z-20 h-16 bg-card border-b border-border flex items-center px-4 gap-4"
            style={{ left: collapsed ? "4rem" : "16rem", transition: "left 0.3s" }}>

            {/* Mobile menu */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="w-5 h-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <Sidebar collapsed={false} onCollapse={() => {}} />
                </SheetContent>
            </Sheet>

            {/* Page Title */}
            <div className="flex-1">
                <h2 className="text-sm font-semibold text-foreground">
                    Welcome back, {user?.name?.split(" ")[0] ?? "User"} 👋
                </h2>
                <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", {
                        weekday: "long", year: "numeric",
                        month: "long", day: "numeric"
                    })}
                </p>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    3
                </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 px-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.avatar ?? undefined} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium leading-none">{user?.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{user?.role}</p>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <User className="w-4 h-4 mr-2" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </header>
    );
}