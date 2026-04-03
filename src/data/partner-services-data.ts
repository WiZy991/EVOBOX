export type PartnerServiceRow = {
  slug: string;
  title: string;
  description: string;
};

/** Тексты карточек (без иконок — безопасно импортировать из client components) */
export const partnerServiceRows: PartnerServiceRow[] = [
  {
    slug: "marking-turnkey",
    title: "Настройка маркировки под ключ",
    description:
      "Полный цикл настройки маркировки, помощь с вводом товаров в оборот и сопутствующие задачи.",
  },
  {
    slug: "utm-terminal",
    title: "Настройка УТМ на терминале",
    description:
      "Подключение и настройка УТМ для корректной работы терминала, быстрая интеграция и стабильный обмен с ЕГАИС.",
  },
  {
    slug: "kkt-reregistration",
    title: "Перерегистрация ККТ Эвотор",
    description:
      "Если меняется юрлицо, фактический адрес торговой точки, ОФД и другие реквизиты — оформим перерегистрацию.",
  },
  {
    slug: "fn-replacement",
    title: "Замена фискального накопителя",
    description:
      "Закрытие архива на старом ФН и регистрация нового фискального накопителя в налоговой.",
  },
  {
    slug: "error-fix",
    title: "Решение ошибок",
    description:
      "Устраняем типовые ошибки Эвотор: связь, фискализация, обновления. Диагностика и понятные шаги.",
  },
  {
    slug: "app-training",
    title: "Обучение приложениям",
    description:
      "Индивидуальное или групповое обучение работе с приложениями, чтобы ускорить процессы на кассе.",
  },
  {
    slug: "evotor-pay",
    title: "Эквайринг Эвотор Pay",
    description:
      "Подключение и настройка Эвотор Pay для приёма безналичных платежей на выгодных условиях.",
  },
  {
    slug: "marketplace-app",
    title: "Настройка приложения из маркета Эвотор",
    description:
      "Профессиональная установка и настройка приложений из маркета Эвотор под задачи вашего бизнеса.",
  },
];

const bySlug = new Map(partnerServiceRows.map((o) => [o.slug, o]));

export function getPartnerServiceBySlug(slug: string): PartnerServiceRow | undefined {
  return bySlug.get(slug);
}
