import nodemailer from "nodemailer";
import { siteConfig } from "@/data/site";
import { formatLeadBody, formatLeadSubject } from "./formatLeadMessage";
import type { LeadApiInput } from "./validators";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;
  const to = process.env.LEAD_RECEIVER_EMAIL || siteConfig.email;

  if (!host || !port || !user || !pass || !from) {
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
        "SMTP не настроен. Заполните SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM в .env",
    };
  }

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
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
