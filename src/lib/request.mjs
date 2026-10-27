/** Text and file sharing are separate capabilities. Nothing here sends a message. */
export const OTHER_BRAND = "__other__";
export function resolveRequestBrand(data) {
  return String(
    data.brand === OTHER_BRAND ? data.otherBrand || "" : data.brand || "",
  )
    .trim()
    .slice(0, 80);
}
export function buildRequestMessage(
  data,
  { photoCount = 0, channel = "chat" } = {},
) {
  const value = (key, max = 600) =>
    String(data[key] || "")
      .trim()
      .slice(0, max);
  const draftId = /^OF-[A-Z0-9]{8}$/.test(value("draftId", 11))
    ? value("draftId", 11)
    : "";
  return [
    "Buongiorno Salvatore, vorrei una valutazione per il mio orologio.",
    draftId ? `Riferimento bozza: ${draftId}` : "",
    `Marchio: ${resolveRequestBrand(data)}`,
    `Modello / referenza: ${value("model", 120) || "Da identificare"}`,
    `Condizioni: ${value("condition", 100)}`,
    `Corredo: ${value("set", 100)}`,
    value("notes") ? `Note: ${value("notes")}` : "",
    photoCount > 0
      ? channel === "share"
        ? `Foto della richiesta: ${photoCount}.`
        : `Ho preparato ${photoCount} foto sul sito, da allegare o condividere in questa chat.`
      : "Posso aggiungere le foto dell’orologio e del corredo in questa chat.",
  ]
    .filter(Boolean)
    .join("\n");
}
export function buildRequest(data, options) {
  return `https://wa.me/393791549804?text=${encodeURIComponent(buildRequestMessage(data, options))}`;
}
export function canSharePhotos(api, files) {
  if (
    !files.length ||
    typeof api?.share !== "function" ||
    typeof api?.canShare !== "function"
  )
    return false;
  try {
    return api.canShare({ files }) === true;
  } catch {
    return false;
  }
}
