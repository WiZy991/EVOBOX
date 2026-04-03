#!/usr/bin/env node
/** Удаляет `.next` — при 404 на /_next/static и MODULE_NOT_FOUND в dev */
import { rmSync } from "fs";
import { join } from "path";

const dir = join(process.cwd(), ".next");
try {
  rmSync(dir, { recursive: true, force: true });
  console.error("Removed .next");
} catch (e) {
  if (e && typeof e === "object" && "code" in e && e.code === "ENOENT") {
    console.error(".next already absent");
  } else {
    throw e;
  }
}
