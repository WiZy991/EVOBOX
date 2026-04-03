import type { LeadApiInput } from "./validators";

const formTypeLabels: Record<LeadApiInput["formType"], string> = {
  consultation: "Получить консультацию",
  request: "Оставить заявку",
  callback: "Заказать звонок",
  product: "Заявка на товар",
  equipment: "Подобрать оборудование",
};

export function formatLeadSubject(data: LeadApiInput): string {
  const type = formTypeLabels[data.formType];
  const extra = data.serviceTopic?.trim() || data.productName?.trim() || "";
  return `[EVOBOX] ${type}${extra ? ` — ${extra}` : ""}`;
}

export function formatLeadBody(data: LeadApiInput): string {
  const lines = [
    `Тип: ${formTypeLabels[data.formType]}`,
    `Имя: ${data.name}`,
    `Город: ${data.city}`,
    `Телефон: ${data.phone}`,
  ];
  if (data.email) lines.push(`Email: ${data.email}`);
  if (data.productName) lines.push(`Товар: ${data.productName}`);
  if (data.productSlug) lines.push(`Slug товара: ${data.productSlug}`);
  if (data.serviceTopic) lines.push(`Услуга: ${data.serviceTopic}`);
  if (data.sourcePage) lines.push(`Страница: ${data.sourcePage}`);
  if (data.comment) lines.push(`Комментарий:\n${data.comment}`);
  lines.push("", `— Заявка с evoboxvl.ru (партнёр Эвотор)`);
  return lines.join("\n");
}
