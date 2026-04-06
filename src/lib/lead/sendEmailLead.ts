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

export async function sendEmailLead(data: LeadApiInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const cfg = getSmtpConfig();
  if (!cfg) {
    return {
      ok: false,
      error:
        "SMTP не настроен. На сервере задайте переменные в файле .env.production (или .env), не в .env.example. Нужны SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.",
    };
  }

  const secure = cfg.port === 465;
  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure,
    requireTLS: !secure && cfg.port === 587,
    auth: { user: cfg.user, pass: cfg.pass },
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
    return { ok: false, error: message };
  }
}
