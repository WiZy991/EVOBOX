# EVOBOX — корпоративный сайт

Production-ready лендинг и многостраничный сайт для **EVOBOX** (evobox.ru): официальные данные по кассам **Эвотор** (каталог, цены «от», ссылки на evotor.ru), блоки услуг партнёра на главной и заявки с отправкой на email. Архитектура рассчитана на последующее подключение CRM SBIS.

## Стек

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS, компоненты в духе shadcn (Radix Slot, Checkbox, Label)
- React Hook Form + Zod
- Nodemailer (SMTP)

## Установка и запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

Сборка:

```bash
npm run build
npm start
```

## Docker

### Установка Docker (Windows)

1. Установите [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/) (WSL 2 или Hyper-V — см. требования на странице документации).
2. Запустите Docker Desktop и дождитесь статуса «Running».

### Сборка образа

Из корня проекта:

```bash
docker build -t evobox:latest .
```

### Запуск через Compose

Переменные для контейнера читаются из **`docker.env`** (в репозитории уже есть безопасные значения по умолчанию). При необходимости отредактируйте файл или добавьте SMTP/SBIS.

```bash
docker compose build
docker compose up
```

Сайт: [http://localhost:3000](http://localhost:3000). Остановка: `Ctrl+C` или `docker compose down`.

Образ собирается в режиме Next.js **`output: "standalone"`** — в контейнер попадает только необходимое для `node server.js`.

## Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните:

| Переменная | Назначение |
|------------|------------|
| `NEXT_PUBLIC_SITE_URL` | Полный URL сайта (canonical, sitemap, OG) |
| `LEAD_RECEIVER_EMAIL` | Ящик для входящих заявок |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Параметры SMTP |
| `SMTP_FROM` | Адрес отправителя (если пусто — используется `SMTP_USER`) |
| `SBIS_ENABLED` | `true` для будущей отправки в SBIS (сейчас заглушка) |
| `SBIS_API_URL`, `SBIS_API_KEY` | Зарезервировано под API SBIS |

Без настроенного SMTP API заявок вернёт ошибку с понятным текстом — формы при этом уже ходят в `POST /api/leads`.

## Где менять контент

- **Контакты, SEO по умолчанию, описание компании** — `src/data/site.ts`
- **Навигация** — `src/data/navigation.ts`
- **Каталог товаров (источник правды для UI)** — `src/data/products.imported.json`; подхватывается в `src/data/products.ts`
- **Услуги партнёра (блок на главной)** — `src/data/partner-services.ts`
- **Нормализация/парсинг при импорте с evotor.ru** — `src/lib/evotor/` (используется скриптом и при ручной сборке данных)

### Обновление цен и картинок с evotor.ru

Рендер страниц **не** ходит на evotor.ru в runtime. Для подтягивания сырых данных (цена «от», кандидаты URL картинок) есть скрипт:

```bash
npm run import:products
```

Он пишет отладочный дамп в `src/data/import-debug.json` и дублирует JSON в stdout. Итог вручную сверяйте и переносите в `products.imported.json` (описания, статусы, характеристики правятся там же).

## Заявки и email

- Обработка: `src/lib/lead/submitLead.ts` (валидация → email → SBIS-заглушка)
- HTTP API: `src/app/api/leads/route.ts`
- Письмо: `src/lib/lead/sendEmailLead.ts`
- Текст письма: `src/lib/lead/formatLeadMessage.ts`

В заявках передаются в том числе **подбор оборудования**, **productSlug**, **sourcePage** (см. `src/types/lead.ts`).

Получатель по умолчанию: `LEAD_RECEIVER_EMAIL`, при отсутствии — `siteConfig.email`.

## Подключение SBIS (позже)

1. Реализовать HTTP-вызов в `src/lib/lead/sendSbisLead.ts` (есть `buildSbisPayload` и TODO).
2. Установить `SBIS_ENABLED=true` и задать `SBIS_API_URL` / `SBIS_API_KEY`.
3. Логику не дублировать в формах — только через `submitLead`.

## Скрипты

- `npm run dev` — разработка
- `npm run build` — production-сборка
- `npm run lint` — ESLint
- `npm run import:products` — черновой импорт карточек с публичных страниц evotor.ru (Node, без браузера)
- Форматирование: `npm run format`

## Лицензия

Проект создан для EVOBOX; права на использование определяются владельцем репозитория.
