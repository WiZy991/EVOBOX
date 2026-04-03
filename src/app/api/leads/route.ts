import { submitLead, type RawLeadBody } from "@/lib/lead/submitLead";
import { checkLeadRateLimit } from "@/lib/lead/rateLimit";
import { NextResponse } from "next/server";

function clientIp(request: Request): string {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!checkLeadRateLimit(`lead:${ip}`)) {
    return NextResponse.json(
      { ok: false, error: "Слишком много попыток. Попробуйте позже." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const result = await submitLead(body as RawLeadBody);

  if (result.ok) {
    return NextResponse.json({ ok: true });
  }

  if (result.code === "SPAM") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const status =
    result.code === "RATE_LIMIT"
      ? 429
      : result.code === "VALIDATION"
        ? 400
        : result.code === "EMAIL" || result.code === "SBIS"
          ? 503
          : 500;

  return NextResponse.json({ ok: false, error: result.error }, { status });
}
