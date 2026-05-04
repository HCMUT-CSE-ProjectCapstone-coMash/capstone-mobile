export function formatDate(isoDate: string): string {
    if (!isoDate) return "—";
    const [year, month, day] = isoDate.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
}