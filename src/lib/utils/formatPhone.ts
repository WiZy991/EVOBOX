/** Display helper; digits source of truth is site config. */
export function formatPhoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("8") && digits.length === 11) {
    return `tel:+7${digits.slice(1)}`;
  }
  if (digits.startsWith("7") && digits.length === 11) {
    return `tel:+${digits}`;
  }
  return `tel:${digits}`;
}
