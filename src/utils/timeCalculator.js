import getNumEnding from "@/utils/getNumEnding";

export function timeCalculator(seconds) {
  const y = Math.floor(seconds / 31536000);
  const mo = Math.floor((seconds % 31536000) / 2628000);
  const d = Math.floor(((seconds % 31536000) % 2628000) / 86400);
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const yearLength = y.toString().length;
  let roundedYear =
    Math.round(y / Math.pow(10, yearLength - 1)) * Math.pow(10, yearLength - 1);

  if (yearLength > 20) {
    roundedYear = "∞";
  }

  return [
    {
      name: getNumEnding(roundedYear, ["год", "года", "лет"]),
      value: roundedYear,
    },
    { name: getNumEnding(mo, ["месяц", "месяца", "месяцев"]), value: mo },
    { name: getNumEnding(d, ["день", "дня", "дней"]), value: d },
    { name: getNumEnding(h, ["час", "часа", "часов"]), value: h },
    { name: getNumEnding(m, ["минута", "минуты", "минут"]), value: m },
    { name: getNumEnding(s, ["секунда", "секунды", "секунд"]), value: s },
  ];
}
