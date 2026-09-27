const SERVICE_TITLES = new Set(["без названия", "основоной раздел"]);

export function isServiceSubsectionTitle(title: string) {
    return SERVICE_TITLES.has(title.trim().toLowerCase());
}
