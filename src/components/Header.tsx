import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";

type HeaderProps = {
    unreadCount?: number;
};

export default function Header({ unreadCount = 3 }: HeaderProps) {
    const displayCount = unreadCount > 9 ? "9+" : String(unreadCount);

    return (
        <header className="shadow-md px-6 py-3 flex justify-end items-center bg-transparent">
            <div className="flex items-center gap-3">
                {/* Notifications button — numeric badge */}
                <button
                    type="button"
                    aria-label={`Notifications, ${unreadCount} unread`}
                    className="relative p-2 rounded-md text-gray hover:bg-white/5 transition focus:outline-none focus:ring-2 focus:ring-white/10"
                >
                    <Bell className="w-5 h-5" />

                    {unreadCount > 0 && (
                        <span
                            aria-hidden={false}
                            role="status"
                            className="absolute -top-1 -right-1 min-w-[1.25rem] px-1.5 py-[0.125rem] text-xs font-semibold leading-none rounded-full bg-[#22c55e] text-white flex items-center justify-center"
                        >
                            {displayCount}
                        </span>
                    )}
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-white text-sm hover:bg-white/5 transition"
                        aria-label="Open account menu"
                    >
                        <Avatar className="h-9 w-9 border-2 border-white/10">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback className="bg-[#7c3aed] text-white">CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="bg-[#0f172a] text-white shadow-lg rounded-md border border-white/6 min-w-[200px] py-1"
                    >
                        <DropdownMenuLabel className="px-3 py-2 text-[#7c3aed] font-semibold">
                            My Account
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator className="border-t border-white/6 mx-3" />

                        <DropdownMenuItem className="px-3 py-2 text-sm rounded-md hover:bg-white/10 hover:text-white transition">
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-3 py-2 text-sm rounded-md hover:bg-white/10 hover:text-white transition">
                            Billing
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-3 py-2 text-sm rounded-md hover:bg-white/10 hover:text-white transition">
                            Team
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="border-t border-white/6 mx-3" />

                        <DropdownMenuItem className="px-3 py-2 text-sm rounded-md hover:bg-white/10 hover:text-white transition flex items-center justify-between">
                            <span>Subscription</span>
                            <span className="text-xs font-medium text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded-full">
                                Active
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
