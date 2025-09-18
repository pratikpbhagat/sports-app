import { useEffect, useState } from "react";

/**
 * useIsMobile — returns true when viewport width is < breakpoint (px).
 * Default breakpoint: 768 (mobile).
 */
export function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState<boolean>(() =>
        typeof window !== "undefined" ? window.innerWidth < breakpoint : false
    );

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        const update = (ev: MediaQueryListEvent | MediaQueryList) =>
            setIsMobile(Boolean("matches" in ev ? ev.matches : mql.matches));

        update(mql); // initial value

        if (typeof mql.addEventListener === "function") {
            mql.addEventListener("change", update as EventListener);
            return () => mql.removeEventListener("change", update as EventListener);
        }

        // fallback for older browsers
        mql.addListener(update as any);
        return () => mql.removeListener(update as any);
    }, [breakpoint]);

    return isMobile;
}
