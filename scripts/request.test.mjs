import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildRequest,
  OTHER_BRAND,
  resolveRequestBrand,
} from "../src/lib/request.mjs";
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
test("An unlisted brand uses the written name in the WhatsApp draft", () => {
  const data = { brand: OTHER_BRAND, otherBrand: "  Grand Seiko & Credor  " };
  assert.equal(resolveRequestBrand(data), "Grand Seiko & Credor");
  const message = new URL(buildRequest(data)).searchParams.get("text");
  assert.ok(message.includes("Marchio: Grand Seiko & Credor"));
  assert.ok(!message.includes(OTHER_BRAND));
  assert.equal(resolveRequestBrand({ ...data, brand: "Rolex" }), "Rolex");
  assert.equal(resolveRequestBrand({ brand: OTHER_BRAND }), "");
});
