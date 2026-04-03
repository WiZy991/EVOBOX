/** Только цифры номера (7XXXXXXXXXX), макс. 11 */
export function phoneDigitsOnly(value: string): string {
  let d = value.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (d.length > 0 && !d.startsWith("7")) d = "7" + d;
  return d.slice(0, 11);
}

/** Маска: +7 (XXX) XXX-XX-XX */
export function formatRuPhoneMask(value: string): string {
  const d = phoneDigitsOnly(value);
  if (d.length === 0) return "";
  let out = "+7";
  if (d.length > 1) {
    out += " (" + d.slice(1, 4);
    if (d.length >= 4) out += ")";
    if (d.length > 4) out += " " + d.slice(4, 7);
    if (d.length > 7) out += "-" + d.slice(7, 9);
    if (d.length > 9) out += "-" + d.slice(9, 11);
  }
  return out;
}

export function isCompleteRuPhone(value: string): boolean {
  return phoneDigitsOnly(value).length === 11;
}
