export function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const [y, m, d] = dateString.split("-");
  return `${d}.${m}.${y}`;
}
