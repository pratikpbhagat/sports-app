import AppLogo from "@/assets/playoffe_app_only_logo.svg?react";
import { Calendar, Home, Search } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MenuItems } from "@/config/MenuItems";
import { Link } from "react-router-dom";

// map menu titles to icons (adjust/add icons as you like)
const iconMap: Record<string, any> = {
    Dashboard: Home,
    Tournaments: Calendar,
    Trainings: Search,
};

export default function AppSidebar() {
    const items = MenuItems();

    const pathname = typeof window !== "undefined" ? window.location.pathname : "";

    return (
        <Sidebar>
            <SidebarContent className="bg-[#0f172a] text-white">
                <div className="flex items-center gap-5 px-4 py-3">
                    <Link to="/" className="inline-flex items-center">
                        <AppLogo className="h-15 w-auto" />
                    </Link>

                    <div className="hidden md:block">
                        <div className="text-2xl font-semibold text-slate-500">PLAYOFFE</div>
                        <div className="text-xs text-slate-500">Trainings & Tournaments</div>
                    </div>
                </div>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const Icon = iconMap[item.title] ?? Home;

                                // mark active when pathname equals the menu url or startsWith for nested routes
                                const isActive =
                                    item.url === "/"
                                        ? pathname === "/"
                                        : pathname === item.url || pathname.startsWith(item.url + "/");

                                // classes
                                const base = "flex items-center gap-3 transition-colors";
                                const activeClasses =
                                    "bg-white/10 text-white rounded-md px-3 py-2"; // subtle highlight + white text
                                const inactiveClasses =
                                    "text-[#7c3aed] hover:bg-[#f6f9fb] hover:text-[#0f172a] px-3 py-2 rounded-md";

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a
                                                href={item.url}
                                                className={`${base} ${isActive ? activeClasses : inactiveClasses}`}
                                                aria-current={isActive ? "page" : undefined}
                                            >
                                                <Icon
                                                    className={`shrink-0 w-6 h-6 ${isActive ? "text-white" : "text-[#7c3aed]"
                                                        }`}
                                                />
                                                <span className={`truncate text-lg ${isActive ? "text-white" : ""}`}>
                                                    {item.title}
                                                </span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
