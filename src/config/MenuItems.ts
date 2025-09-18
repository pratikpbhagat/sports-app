import type { MenuItem } from "@/types/menuItem";
import { lazy } from "react";

const HomePage = lazy(() => import("@/pages/HomePage"));
const TournamentsPage = lazy(() => import("@/pages/TournamentsPage"));
const TrainingsPage = lazy(() => import("@/pages/TrainingsPage"));

export const MenuItems = (): MenuItem[] => {
    return [
        {
            title: "Dashboard",
            url: "/home",
            component: HomePage,
        },
        {
            title: "Tournaments",
            url: "/tournaments",
            component: TournamentsPage,
        },
        {
            title: "Trainings",
            url: "/trainings",
            component: TrainingsPage,
        },
    ];
};
