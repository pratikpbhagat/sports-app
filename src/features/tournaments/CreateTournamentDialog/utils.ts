export function uid(prefix = "") {
    return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

export function readFileAsDataURL(file: File): Promise<string | null> {
    return new Promise((res) => {
        if (!file) return res(null);
        const reader = new FileReader();
        reader.onload = (ev) => res(typeof ev.target?.result === "string" ? ev.target?.result : null);
        reader.onerror = () => res(null);
        reader.readAsDataURL(file);
    });
}
