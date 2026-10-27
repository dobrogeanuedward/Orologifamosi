import {
  buildRequest,
  buildRequestMessage,
  canSharePhotos,
  OTHER_BRAND,
  resolveRequestBrand,
} from "./request.mjs";
import {
  validatePhoto,
  validatePreparedPhoto,
  preparePhoto,
} from "./photos.mjs";

type Photo = {
  id: number;
  file: File;
  preview: string;
  signature: string;
};
const form = document.querySelector<HTMLFormElement>("#valuation-form");
if (form) {
  const root = form.closest<HTMLElement>(".request-workbench")!;
  const get = <T extends Element = HTMLElement>(selector: string) =>
    root.querySelector<T>(selector)!;
  const steps = Array.from(
    form.querySelectorAll<HTMLFieldSetElement>("[data-step]"),
  );
  const labels = ["Orologio", "Dettagli", "Foto", "Invio"];
  const draftId =
    "OF-" +
    Array.from(crypto.getRandomValues(new Uint8Array(4)), (n) =>
      n.toString(16).padStart(2, "0"),
    )
      .join("")
      .toUpperCase();
  const fileInput = get<HTMLInputElement>("#watch-photos"),
    cameraInput = get<HTMLInputElement>("#watch-camera");
  const deliveryStatus = get("#request-delivery-status");
  let current = 0,
    photos: Photo[] = [],
    nextPhotoId = 0,
    preparing = false,
    sharing = false;
  const brandSelect = get<HTMLSelectElement>("#brand"),
    otherBrand = get<HTMLInputElement>("#other-brand"),
    otherBrandField = get<HTMLElement>("#other-brand-field");
  const read = () => {
    const data = Object.fromEntries(new FormData(form).entries());
    return { ...data, brand: resolveRequestBrand(data), draftId };
  };
  function syncOtherBrand(focus = false) {
    const isOther = brandSelect.value === OTHER_BRAND;
    otherBrandField.hidden = !isOther;
    otherBrand.disabled = !isOther;
    otherBrand.required = isOther;
    otherBrand.setCustomValidity(
      isOther && otherBrand.value.length > 0 && !otherBrand.value.trim()
        ? "Scrivi il nome del marchio."
        : "",
    );
    if (isOther && focus) otherBrand.focus();
  }
  brandSelect.addEventListener("change", () => syncOtherBrand(true));
  otherBrand.addEventListener("input", () => syncOtherBrand());
  syncOtherBrand();
  const announce = (text: string) => {
    deliveryStatus.textContent = text;
  };
  const logAction = (name: string) =>
    document.dispatchEvent(
      new CustomEvent("orologi:action", {
        detail: { name, page: location.pathname },
      }),
    );
  get("#passport-reference").textContent = draftId;

  function updatePassport() {
    const data = read() as Record<string, string>;
    get("#passport-brand").textContent = data.brand || "Il tuo orologio";
    get("#passport-model").textContent =
      data.model.trim() || "Modello da conoscere";
    get("#passport-condition").textContent = data.condition || "Da specificare";
    get("#passport-set").textContent = data.set || "Da specificare";
    get("#passport-photos").textContent = photos.length
      ? `${photos.length} ${photos.length === 1 ? "foto preparata" : "foto preparate"}`
      : "Nessuna selezionata";
    form!
      .querySelectorAll<HTMLButtonElement>("[data-brand-choice]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.brandChoice === data.brand),
        ),
      );
    const image = get<HTMLImageElement>("#passport-image");
    image.hidden = photos.length === 0;
    get(".passport-photo").classList.toggle("has-photo", photos.length > 0);
    if (photos.length) image.src = photos[0].preview;
    else image.removeAttribute("src");
  }

  function updateFinish() {
    const data = read() as Record<string, string>;
    const summary = get("#request-summary");
    summary.replaceChildren();
    for (const [label, value] of [
      ["Marchio", data.brand],
      ["Modello", data.model || "Da identificare"],
      ["Condizioni", data.condition],
      ["Corredo", data.set],
      ["Note", data.notes],
    ]) {
      if (!value) continue;
      const dt = document.createElement("dt"),
        dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      summary.append(dt, dd);
    }
    get("#request-photo-summary").textContent = photos.length
      ? `${photos.length} ${photos.length === 1 ? "foto preparata" : "foto preparate"}`
      : "Nessuna foto selezionata";
    const thumbnails = get("#request-final-photos");
    thumbnails.replaceChildren();
    photos.forEach((photo, index) => {
      const image = document.createElement("img");
      image.src = photo.preview;
      image.alt = `Foto ${index + 1} della richiesta`;
      image.width = image.height = 70;
      const open = document.createElement("button");
      open.type = "button";
      open.dataset.viewPhoto = String(photo.id);
      open.setAttribute("aria-label", `Ingrandisci foto ${index + 1}`);
      open.append(image);
      thumbnails.append(open);
    });
    const shareAvailable = canSharePhotos(
      navigator,
      photos.map((p) => p.file),
    );
    get<HTMLElement>("#request-share-files").hidden = !shareAvailable;
    const direct = get<HTMLButtonElement>("#direct-chat");
    direct.classList.toggle("is-secondary", shareAvailable);
    get("#request-delivery-note").textContent = photos.length
      ? shareAvailable
        ? "Questo pulsante apre la chat giusta con il messaggio preparato, senza allegare automaticamente le foto."
        : "La condivisione di queste foto insieme non è disponibile. Puoi provare con meno foto oppure aprire la chat e aggiungerle da WhatsApp. Puoi anche salvarle dalle anteprime del passaggio Foto."
      : "La chat si aprirà con il testo preparato. Il messaggio parte solo quando premi invia in WhatsApp.";
    get("#request-message").textContent = buildRequestMessage(data, {
      photoCount: photos.length,
    });
  }

  function show(index: number) {
    if (index < 0 || index >= steps.length || preparing || sharing) return;
    current = index;
    steps.forEach((step, i) => {
      step.hidden = i !== index;
    });
    form!
      .querySelectorAll<HTMLElement>("[data-indicator]")
      .forEach((indicator, i) => {
        indicator.classList.toggle("active", i <= index);
        indicator.classList.toggle("complete", i < index);
        if (i === index) indicator.setAttribute("aria-current", "step");
        else indicator.removeAttribute("aria-current");
      });
    get("#request-step-count").textContent = `0${index + 1} / 04`;
    get("#step-announcement").textContent =
      `Passaggio ${index + 1} di 4: ${labels[index]}`;
    if (index === 3) {
      updateFinish();
      announce("");
    }
    updatePassport();
    const legend = steps[index].querySelector("legend")!;
    legend.tabIndex = -1;
    legend.focus();
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
      steps[index].animate(
        [
          { opacity: 0.4, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 260, easing: "cubic-bezier(.22,1,.36,1)" },
      );
  }
  function next() {
    if (preparing || sharing) return;
    const invalid = Array.from(
      steps[current].querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >("input,select,textarea"),
    ).find((control) => !control.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      return;
    }
    show(current + 1);
  }
  form
    .querySelectorAll<HTMLButtonElement>(".next")
    .forEach((button) => button.addEventListener("click", next));
  form
    .querySelectorAll<HTMLButtonElement>(".back")
    .forEach((button) =>
      button.addEventListener("click", () => show(current - 1)),
    );
  form
    .querySelectorAll<HTMLButtonElement>("[data-edit-step]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        show(Number(button.dataset.editStep)),
      ),
    );
  form
    .querySelectorAll<HTMLButtonElement>("[data-brand-choice]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        get<HTMLSelectElement>("#brand").value = button.dataset.brandChoice!;
        syncOtherBrand();
        updatePassport();
      }),
    );
  form.addEventListener("input", updatePassport);
  form.addEventListener("change", updatePassport);

  function renderPhotos() {
    const list = get("#photo-preview-list");
    list.replaceChildren();
    const template = get<HTMLTemplateElement>("#request-photo-template");
    photos.forEach((photo, index) => {
      const clone = template.content.cloneNode(true) as DocumentFragment;
      const image = clone.querySelector("img")!;
      image.src = photo.preview;
      image.alt = `Foto ${index + 1} della richiesta`;
      clone.querySelector(".request-photo-label")!.textContent =
        `Foto ${index + 1}`;
      clone.querySelector(".request-photo-size")!.textContent =
        `${Math.max(1, Math.round(photo.file.size / 1024))} KB`;
      const open = clone.querySelector<HTMLButtonElement>(
        ".request-photo-open",
      )!;
      open.dataset.viewPhoto = String(photo.id);
      open.setAttribute("aria-label", `Ingrandisci foto ${index + 1}`);
      const remove = clone.querySelector<HTMLButtonElement>(
        ".request-photo-remove",
      )!;
      remove.dataset.removePhoto = String(photo.id);
      remove.setAttribute("aria-label", `Rimuovi foto ${index + 1}`);
      remove.disabled = preparing;
      const save = clone.querySelector<HTMLAnchorElement>(
        ".request-photo-save",
      )!;
      save.href = photo.preview;
      save.download = photo.file.name;
      save.setAttribute("aria-label", `Salva foto ${index + 1}`);
      list.append(clone);
    });
    updatePassport();
  }
  function setPreparing(value: boolean) {
    preparing = value;
    fileInput.disabled = cameraInput.disabled = value;
    get("#photo-dropzone").setAttribute("aria-busy", String(value));
    root!
      .querySelectorAll<HTMLButtonElement>(".next,.back,[data-remove-photo]")
      .forEach((button) => {
        button.disabled = value;
      });
  }
  function updatePhotoStatus(emptyMessage = "") {
    const bytes = photos.reduce((sum, photo) => sum + photo.file.size, 0);
    const size =
      bytes < 1024 * 1024
        ? `${Math.max(1, Math.round(bytes / 1024))} KB`
        : `${new Intl.NumberFormat("it-IT", { maximumFractionDigits: 1 }).format(bytes / (1024 * 1024))} MB`;
    get("#photo-progress").textContent = photos.length
      ? `${photos.length} ${photos.length === 1 ? "foto pronta" : "foto pronte"} · ${size} dopo l’ottimizzazione.`
      : emptyMessage;
  }
  async function addPhotos(files: File[]) {
    if (preparing || !files.length) return;
    const errors: string[] = [];
    get("#photo-errors").textContent = "";
    setPreparing(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i],
          signature = `${file.name}/${file.size}/${file.lastModified}`;
        if (photos.some((photo) => photo.signature === signature)) {
          errors.push("Una foto già selezionata è stata saltata.");
          continue;
        }
        const error = validatePhoto(file);
        if (error) {
          errors.push(error);
          continue;
        }
        get("#photo-progress").textContent =
          `Preparo la foto ${i + 1} di ${files.length}…`;
        try {
          const id = ++nextPhotoId;
          const prepared = await preparePhoto(
            file,
            `${draftId.toLowerCase()}-foto-${id}.jpg`,
          );
          const preparedError = validatePreparedPhoto(
            prepared,
            photos.reduce((sum, photo) => sum + photo.file.size, 0),
          );
          if (preparedError) {
            errors.push(preparedError);
            continue;
          }
          photos.push({
            id,
            file: prepared,
            preview: URL.createObjectURL(prepared),
            signature,
          });
          renderPhotos();
        } catch (error) {
          errors.push(
            error instanceof Error
              ? error.message
              : "Questa foto non è stata aggiunta. Prova con un’altra immagine.",
          );
        }
      }
    } finally {
      setPreparing(false);
      renderPhotos();
      fileInput.value = cameraInput.value = "";
      updatePhotoStatus();
      get("#photo-errors").textContent = Array.from(new Set(errors)).join(" ");
    }
  }
  [fileInput, cameraInput].forEach((input) =>
    input.addEventListener(
      "change",
      () => void addPhotos(Array.from(input.files || [])),
    ),
  );
  const dropzone = get("#photo-dropzone");
  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (!preparing) dropzone.classList.add("is-dragging");
  });
  dropzone.addEventListener("dragleave", (event) => {
    if (!dropzone.contains((event as DragEvent).relatedTarget as Node))
      dropzone.classList.remove("is-dragging");
  });
  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("is-dragging");
    void addPhotos(Array.from((event as DragEvent).dataTransfer?.files || []));
  });
  get("#photo-preview-list").addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>(
      "[data-remove-photo]",
    );
    if (!button || preparing) return;
    const photo = photos.find(
      (p) => p.id === Number(button.dataset.removePhoto),
    );
    if (!photo) return;
    URL.revokeObjectURL(photo.preview);
    get("#photo-errors").textContent = "";
    photos = photos.filter((p) => p.id !== photo.id);
    renderPhotos();
    updatePhotoStatus("Foto rimossa. Puoi sceglierne altre.");
    const remaining = root!.querySelector<HTMLButtonElement>(
      "[data-remove-photo]",
    );
    if (remaining) remaining.focus();
    else fileInput.focus();
  });

  const viewer = get<HTMLDialogElement>("#request-photo-viewer");
  let viewerIndex = 0;
  function showViewer(index: number) {
    if (!photos.length) return;
    viewerIndex = (index + photos.length) % photos.length;
    const photo = photos[viewerIndex];
    const image = get<HTMLImageElement>("#request-viewer-image");
    image.src = photo.preview;
    image.alt = `Foto ${viewerIndex + 1} della richiesta`;
    get("#request-viewer-caption").textContent =
      `Foto ${viewerIndex + 1} di ${photos.length}`;
    get<HTMLButtonElement>("[data-viewer-previous]").disabled =
      photos.length < 2;
    get<HTMLButtonElement>("[data-viewer-next]").disabled = photos.length < 2;
  }
  root.addEventListener("click", (event) => {
    const open = (event.target as Element).closest<HTMLButtonElement>(
      "[data-view-photo]",
    );
    if (!open) return;
    const index = photos.findIndex(
      (p) => p.id === Number(open.dataset.viewPhoto),
    );
    if (index < 0) return;
    showViewer(index);
    if (!viewer.open) viewer.showModal();
  });
  get(".request-viewer-close").addEventListener("click", () => viewer.close());
  get("[data-viewer-previous]").addEventListener("click", () =>
    showViewer(viewerIndex - 1),
  );
  get("[data-viewer-next]").addEventListener("click", () =>
    showViewer(viewerIndex + 1),
  );
  viewer.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showViewer(viewerIndex + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });
  viewer.addEventListener("close", () =>
    get<HTMLImageElement>("#request-viewer-image").removeAttribute("src"),
  );

  get("#share-photos").addEventListener("click", async () => {
    if (sharing || preparing) return;
    const files = photos.map((p) => p.file);
    if (!canSharePhotos(navigator, files)) {
      updateFinish();
      announce(
        "La condivisione di queste foto insieme non è disponibile. Puoi provare con meno foto oppure aprire la chat e allegarle da WhatsApp.",
      );
      return;
    }
    const button = get<HTMLButtonElement>("#share-photos");
    try {
      // Call from the click itself, before any await: preserve the user gesture.
      const operation = navigator.share({
        files,
        text: buildRequestMessage(read(), {
          photoCount: photos.length,
          channel: "share",
        }),
        title: `Valutazione orologio · ${draftId}`,
      });
      sharing = true;
      button.disabled = true;
      get("#direct-chat").setAttribute("aria-disabled", "true");
      await operation;
      logAction("request_share_handoff");
      announce(
        "Se hai condiviso le foto, completa o controlla il messaggio nella chat di Salvatore. La ricezione non può essere verificata dal sito.",
      );
    } catch (error) {
      announce(
        error instanceof Error && error.name === "AbortError"
          ? "Condivisione annullata. Foto e richiesta sono ancora qui."
          : "Non è stato possibile aprire la condivisione. Le foto sono ancora qui: puoi riprovare o aprire la chat e allegarle da WhatsApp.",
      );
    } finally {
      sharing = false;
      button.disabled = false;
      get("#direct-chat").removeAttribute("aria-disabled");
    }
  });
  async function copyText(text: string, success: string) {
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      announce(success);
    } catch {
      announce(
        "Non è possibile copiare automaticamente. Il numero e il testo sono visibili qui sotto.",
      );
      get<HTMLDetailsElement>(".request-message-preview").open = true;
    }
  }
  get(".request-copy-number").addEventListener(
    "click",
    () =>
      void copyText(
        "+39 379 154 9804",
        "Numero copiato. Seleziona Salvatore come destinatario in WhatsApp.",
      ),
  );
  get("#copy-request").addEventListener(
    "click",
    () =>
      void copyText(
        buildRequestMessage(read(), { photoCount: photos.length }),
        "Testo copiato. Puoi incollarlo nella chat di Salvatore.",
      ),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (preparing || sharing) return;
    if (current !== 3) {
      next();
      return;
    }
    logAction("whatsapp_open");
    window.location.assign(buildRequest(read(), { photoCount: photos.length }));
  });
  addEventListener("pagehide", (event) => {
    if (!(event as PageTransitionEvent).persisted)
      photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
  });
  updatePassport();
}
