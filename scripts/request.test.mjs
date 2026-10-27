import { test } from "node:test";
import assert from "node:assert/strict";
import { buildRequest } from "../src/lib/request.mjs";
test("WhatsApp opens the real business number with encoded details and no automatic send", () => {
  const url = new URL(
    buildRequest({
      brand: "Baume & Mercier",
      model: "Clifton / 100 €",
      condition: "Usato",
      set: "Scatola e documenti",
      notes: "Revisione\n2024 & cinturino",
    }),
  );
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/393791549804");
  const text = url.searchParams.get("text");
  assert.ok(text.includes("Baume & Mercier"));
  assert.ok(text.includes("Clifton / 100 €"));
  assert.ok(text.includes("Revisione\n2024 & cinturino"));
  assert.equal(url.searchParams.size, 1);
});
test("Unknown reference gets an honest fallback, and notes are bounded", () => {
  const text = new URL(
    buildRequest({ brand: "Rolex", notes: "x".repeat(900) }),
  ).searchParams.get("text");
  assert.ok(text.includes("Da identificare"));
  assert.ok(!text.includes("x".repeat(601)));
});
