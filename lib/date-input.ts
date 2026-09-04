const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const SPANISH_DATE = /^(\d{2})\/(\d{2})\/(\d{4})$/;

function validDate(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function parseSpanishDate(value: string) {
  const match = value.trim().match(SPANISH_DATE);
  if (!match) return "";
  const [, day, month, year] = match;
  if (!validDate(Number(year), Number(month), Number(day))) return "";
  return `${year}-${month}-${day}`;
}

export function formatSpanishDate(value: string) {
  const match = value.match(ISO_DATE);
  if (!match) return "";
  const [, year, month, day] = match;
  return validDate(Number(year), Number(month), Number(day)) ? `${day}/${month}/${year}` : "";
}
