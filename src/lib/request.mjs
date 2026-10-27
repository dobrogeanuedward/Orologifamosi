/** Builds a WhatsApp draft. It never sends or stores a request. */
export function buildRequest(data) {
  const value = (key, max = 600) =>
    String(data[key] || "")
      .trim()
      .slice(0, max);
  const message = [
    "Buongiorno Salvatore, vorrei una valutazione per il mio orologio.",
    `Marchio: ${value("brand", 50)}`,
    `Modello / referenza: ${value("model", 120) || "Da identificare"}`,
    `Condizioni: ${value("condition", 100)}`,
    `Corredo: ${value("set", 100)}`,
    value("notes") ? `Note: ${value("notes")}` : "",
    "Allego qui le foto dell’orologio e del corredo disponibile.",
  ]
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/393791549804?text=${encodeURIComponent(message)}`;
}
