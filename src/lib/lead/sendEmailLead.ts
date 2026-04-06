import nodemailer from "nodemailer";
import { siteConfig } from "@/data/site";
import { formatLeadBody, formatLeadSubject } from "./formatLeadMessage";
import type { LeadApiInput } from "./validators";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const portRaw = process.env.SMTP_PORT?.trim();
  const port = portRaw ? Number(portRaw) : NaN;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = (process.env.SMTP_FROM?.trim() || user)?.trim();
  const to = process.env.LEAD_RECEIVER_EMAIL?.trim() || siteConfig.email;

  if (!host || !Number.isFinite(port) || !user || !pass || !from) {
    return null;
  }
  return { host, port, user, pass, from, to };
}

/** Понятный текст на сайте без утечки внутренних деталей SMTP */
function publicSmtpError(raw: string): string {
  const m = raw.toLowerCase();
  if (
    m.includes("535") ||
    m.includes("authentication credentials invalid") ||
    m.includes("invalid login") ||
    m.includes("auth failed") ||
    m.includes("535 5.7")
  ) {
    return "Почтовый сервер отклонил логин или пароль (ошибка авторизации SMTP). Проверьте на хостинге: SMTP_HOST, SMTP_USER (полный email), SMTP_PASS; при двухфакторной защите нужен пароль приложения. После смены пароля перезапустите сайт: pm2 restart evobox --update-env";
  }
  if (m.includes("econnrefused") || m.includes("getaddrinfo") || m.includes("enotfound")) {
    return "Не удаётся подключиться к SMTP-серверу. Проверьте SMTP_HOST и порт (465 или 587).";
  }
  return raw.length > 200 ? `${raw.slice(0, 200)}…` : raw;
}

export async function sendEmailLead(data: LeadApiInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const cfg = getSmtpConfig();
  if (!cfg) {
    return {
      ok: false,
      error:
        "SMTP не настроен. На сервере задайте переменные в `.env.production` или `.env` (не в `.env.example`). Нужны SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS. После правок: pm2 restart evobox --update-env",
    };
  }

  const secure = cfg.port === 465;
  const rejectUnauthorized = process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== "false";

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure,
    requireTLS: !secure && cfg.port === 587,
    auth: { user: cfg.user, pass: cfg.pass },
    connectionTimeout: 20_000,
    greetingTimeout: 15_000,
    tls: {
      rejectUnauthorized,
      minVersion: "TLSv1.2" as const,
    },
  });

  const subject = formatLeadSubject(data);
  const text = formatLeadBody(data);

  try {
    await transporter.sendMail({
      from: cfg.from,
      to: cfg.to,
      replyTo: data.email || undefined,
      subject,
      text,
    });
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка отправки email";
    console.error("[evobox lead] SMTP:", message);
    return { ok: false, error: publicSmtpError(message) };
  }
}
