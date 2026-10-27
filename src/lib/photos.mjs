export const PHOTO_LIMITS = Object.freeze({
  fileBytes: 20 * 1024 * 1024,
  totalBytes: 40 * 1024 * 1024,
  edge: 2600,
  pixels: 60_000_000,
});
export function validatePhoto(file) {
  const supported =
    /^(image\/(jpeg|png|webp|heic|heif))$/.test(file.type || "") ||
    (!file.type && /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name));
  if (!supported)
    return "Scegli una foto JPEG, PNG, WebP o HEIC. Documenti PDF e immagini SVG non sono accettati.";
  if (!file.size) return "Questa foto è vuota. Scegli un altro file.";
  if (file.size > PHOTO_LIMITS.fileBytes)
    return "Questa foto supera 20 MB. Scegli una versione più leggera.";
  return "";
}
/** Apply the total budget to the re-encoded files, never to the original batch. */
export function validatePreparedPhoto(file, bytes = 0) {
  if (bytes + file.size > PHOTO_LIMITS.totalBytes)
    return "Le foto già ottimizzate supererebbero 40 MB in totale. Questa foto non è stata aggiunta: puoi rimuoverne una o scegliere un file più leggero.";
  return "";
}
/** Only photographic byte formats; a renamed SVG must never be decoded as a photo. */
export function hasPhotoSignature(bytes) {
  const ascii = (start, end) => String.fromCharCode(...bytes.slice(start, end));
  return (
    (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) ||
    [137, 80, 78, 71, 13, 10, 26, 10].every(
      (value, index) => bytes[index] === value,
    ) ||
    (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") ||
    (ascii(4, 8) === "ftyp" &&
      /heic|heix|hevc|hevx|heim|heis|mif1|msf1/.test(ascii(8, 64)))
  );
}
/** Decode and re-encode locally: no HTTP request, no storage, no original metadata copied. */
export async function preparePhoto(file, filename) {
  if (!hasPhotoSignature(new Uint8Array(await file.slice(0, 64).arrayBuffer())))
    throw new Error(
      "Il contenuto di questo file non è una foto supportata. Scegli un JPEG, PNG, WebP o HEIC valido.",
    );
  const url = URL.createObjectURL(file);
  const image = new Image();
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        image.src = "";
        reject(
          new Error(
            "Questa foto impiega troppo tempo a caricarsi. Prova una versione JPEG.",
          ),
        );
      }, 15000);
      image.onload = () => {
        clearTimeout(timer);
        resolve();
      };
      image.onerror = () => {
        clearTimeout(timer);
        reject(
          new Error(
            "Non riesco a leggere questa foto. Prova una versione JPEG, PNG o WebP.",
          ),
        );
      };
      image.src = url;
    });
    const width = image.naturalWidth,
      height = image.naturalHeight;
    if (!width || !height || width * height > PHOTO_LIMITS.pixels)
      throw new Error(
        "Questa foto è troppo grande da preparare qui. Scegli una versione con dimensioni inferiori.",
      );
    const scale = Math.min(1, PHOTO_LIMITS.edge / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context)
      throw new Error(
        "Non è possibile preparare questa foto sul dispositivo. Puoi allegarla direttamente in WhatsApp.",
      );
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9),
    );
    canvas.width = canvas.height = 1;
    if (!blob)
      throw new Error(
        "Non è stato possibile preparare la foto. Prova con un’altra immagine.",
      );
    return new File([blob], filename, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(url);
    image.src = "";
  }
}
