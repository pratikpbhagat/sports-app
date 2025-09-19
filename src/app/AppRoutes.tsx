import React, { Suspense, useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import { MenuItems } from "@/config/MenuItems";
import type { MenuItem } from "@/types/menuItem";
import ProfilePage from "@/pages/ProfilePage";
import TeamPage from "@/pages/TeamPage";
import BillingPage from "@/pages/BillingPage";
import NotificationsPage from "@/pages/NotificationsPage";

export default function AppRoutes() {
    // Memoize menu items so lazy components aren't re-created on every render
    const menuItems = useMemo(() => MenuItems(), []);

    const renderRoutes = (items: MenuItem[]): React.ReactNode[] =>
        items.flatMap((item) => {
            const Elem = item.component; // capitalized variable for JSX
            return [
                item.component ? (
                    <Route
                        key={item.url}
                        path={item.url}
                        element={
                            <Suspense fallback={<div className="p-4">Loading...</div>}>
                                <Elem />
                            </Suspense>
                        }
                    />
                ) : null,
                item.children ? renderRoutes(item.children) : null,
            ];
        });

    return (
        <Routes>
            <Route
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<Navigate to="/home" />} />
                {renderRoutes(menuItems)}
                <Route
                    path="/profile"
                    element={
                        <Suspense fallback={<div className="p-4">Loading profile…</div>}>
                            <ProfilePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/billing"
                    element={
                        <Suspense fallback={<div className="p-4">Loading profile…</div>}>
                            <BillingPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/team"
                    element={
                        <Suspense fallback={<div className="p-4">Loading profile…</div>}>
                            <TeamPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/notifications"
                    element={
                        <Suspense fallback={<div className="p-4">Loading profile…</div>}>
                            <NotificationsPage />
                        </Suspense>
                    }
                />
            </Route>
        </Routes>
    );
}
