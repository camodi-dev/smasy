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
    const notifications = pageProps.notifications?.items ?? [];
    const unreadCount = pageProps.notifications?.unread_count ?? 0;

    const initials = user?.name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) ?? "U";

    function handleLogout() {
        router.post("/logout");
    }

    function markNotificationAsRead(notificationId: number, isRead: boolean) {
        if (isRead) {
            return;
        }

        router.post(`/notifications/${notificationId}/read`, {}, { preserveScroll: true });
    }

    function markAllNotificationsAsRead() {
        router.post("/notifications/read-all", {}, { preserveScroll: true });
    }

    function formatNotificationDate(value?: string | null) {
        if (!value) return "";
        return new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </Badge>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                className="text-xs text-primary hover:underline"
                                onClick={markAllNotificationsAsRead}
                            >
                                Mark all read
                            </button>
                        )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length === 0 ? (
                        <div className="px-3 py-6 text-sm text-muted-foreground text-center">
                            No notifications yet.
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className="items-start gap-2 py-3 cursor-pointer"
                                onClick={() => markNotificationAsRead(notification.id, notification.is_read)}
                            >
                                {!notification.is_read && (
                                    <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                                )}
                                {notification.is_read && (
                                    <span className="mt-1 h-2 w-2 rounded-full bg-muted shrink-0" />
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{notification.title}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {notification.content}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-1">
                                        {formatNotificationDate(notification.published_at ?? notification.created_at)}
                                    </p>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

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
                    <DropdownMenuItem onClick={() => router.visit("/profile")}>
                        <User className="w-4 h-4 mr-2" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.visit("/profile")}>
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