"use client";

import logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Rocket,
    Gift,
    Trophy,
    Upload,
    Settings,
    LogOut,
    Menu,
    X,
    User as UserIcon,
    ChevronDown
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Challenges", href: "/dashboard/challenges", icon: Rocket },
    { name: "Rewards", href: "/dashboard/rewards", icon: Gift },
    { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
    { name: "Add Pose", href: "/dashboard/addpose", icon: Upload },
];

export function DashboardNavbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut({ callbackUrl: "/" });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const userAvatar = session?.user?.image || "https://avatars.githubusercontent.com/u/117257768?v=4";

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <Image src={logo} alt="FitVibe logo" width={32} height={32} />
                                <span className="font-bold text-xl text-white">
                                    Fit<span className="text-yellow-400">Vibe</span>
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-yellow-400/10 text-yellow-400"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Profile Dropdown */}
                        <div className="hidden md:flex items-center gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden ring-2 ring-transparent hover:ring-yellow-400/50 transition-all">
                                        <Image
                                            src={userAvatar}
                                            alt="User"
                                            width={40}
                                            height={40}
                                            className="h-full w-full object-cover"
                                        />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-zinc-900 border-white/10 text-white" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none text-white">{session?.user?.name || "User"}</p>
                                            <p className="text-xs leading-none text-gray-400">
                                                {session?.user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                                        <Link href="/dashboard/profile" className="flex w-full items-center">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem
                                        className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="text-white"
                            >
                                <Menu className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl md:hidden">
                    <div className="flex flex-col h-full bg-zinc-900/50">
                        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
                            <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                <Image src={logo} alt="FitVibe logo" width={32} height={32} />
                                <span className="font-bold text-xl text-white">
                                    Fit<span className="text-yellow-400">Vibe</span>
                                </span>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-white"
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-6 px-4">
                            {/* User Info Mobile */}
                            <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-xl">
                                <Image
                                    src={userAvatar}
                                    alt="User"
                                    width={48}
                                    height={48}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                                <div>
                                    <div className="font-medium text-white">{session?.user?.name || "User"}</div>
                                    <div className="text-sm text-gray-400">{session?.user?.email}</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                                                isActive
                                                    ? "bg-yellow-400 text-black"
                                                    : "text-gray-300 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                                <Link
                                    href="/dashboard/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                                >
                                    <Settings className="w-5 h-5" />
                                    Settings
                                </Link>
                            </div>
                        </div>

                        <div className="p-4 border-t border-white/10">
                            <Button
                                variant="destructive"
                                className="w-full justify-start pl-4"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-5 h-5 mr-2" />
                                Log out
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
