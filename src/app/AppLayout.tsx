import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout() {

    return (
        <div className="min-h-screen flex bg-slate-50">
            <SidebarProvider>
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="p-6">
                        <Outlet />
                    </main>
                </div>
            </SidebarProvider>
        </div>
    );
}
