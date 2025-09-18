import React, { Suspense, useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import { MenuItems } from "@/config/MenuItems";
import type { MenuItem } from "@/types/menuItem";

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
            </Route>
        </Routes>
    );
}
