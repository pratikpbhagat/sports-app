import type { MenuItem } from "@/types/menuItem";
import { lazy } from "react";

const HomePage = lazy(() => import("@/pages/HomePage"));
const TournamentsPage = lazy(() => import("@/pages/TournamentsPage"));
const TrainingsPage = lazy(() => import("@/pages/TrainingsPage"));
const TournamentHistoryPage = lazy(() => import("@/pages/TournamentHistoryPage"));
const TrainingsHistoryPage = lazy(() => import("@/pages/TrainingsHistoryPage"));
const SubscriptionPage = lazy(() => import("@/pages/SubscriptionPage"));
const TeamPage = lazy(() => import("@/pages/TeamPage"))
    ;
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
            children: [
                {
                    title: "Tournament History",
                    url: "/tournaments/history",
                    component: TournamentHistoryPage
                }
            ]
        },
        {
            title: "Trainings",
            url: "/trainings",
            component: TrainingsPage,
            children: [
                {
                    title: "Training History",
                    url: "/trainings/history",
                    component: TrainingsHistoryPage
                }
            ]
        },
        {
            title: "Subscriptions",
            url: "/subscriptions",
            component: SubscriptionPage,
        }
    ];
};
