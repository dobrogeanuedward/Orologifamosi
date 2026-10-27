import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PHOTO_LIMITS,
  validatePhoto,
  validatePreparedPhoto,
  hasPhotoSignature,
} from "../src/lib/photos.mjs";
import { buildRequestMessage, canSharePhotos } from "../src/lib/request.mjs";
const photo = { name: "watch.jpg", type: "image/jpeg", size: 400_000 };
test("Photo selection limits reject unsupported files, empty files and excessive sizes", () => {
  assert.equal(validatePhoto(photo), "");
  assert.ok(
    validatePhoto({ ...photo, type: "image/svg+xml", name: "watch.svg" }),
  );
  assert.ok(validatePhoto({ ...photo, size: 0 }));
  assert.ok(validatePhoto({ ...photo, size: PHOTO_LIMITS.fileBytes + 1 }));
  // Original batches above 40 MB are allowed: the total budget is checked after preparation.
  for (let i = 0; i < 12; i++) {
    assert.equal(validatePhoto({ ...photo, size: PHOTO_LIMITS.fileBytes }), "");
  }
  assert.equal(
    validatePreparedPhoto(photo, PHOTO_LIMITS.totalBytes - photo.size),
    "",
  );
  assert.ok(
    validatePreparedPhoto(photo, PHOTO_LIMITS.totalBytes - photo.size + 1),
  );
  assert.equal(validatePhoto({ ...photo, name: "camera.heic", type: "" }), "");
});
test("Photographic signatures reject renamed markup and keep common photo formats", () => {
  const bytes = (s) => new TextEncoder().encode(s);
  assert.ok(hasPhotoSignature(new Uint8Array([255, 216, 255, 0])));
  assert.ok(
    hasPhotoSignature(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])),
  );
  assert.ok(hasPhotoSignature(bytes("RIFF0000WEBP")));
  assert.ok(hasPhotoSignature(bytes("0000ftypheic")));
  assert.equal(
    hasPhotoSignature(bytes('<svg xmlns="http://www.w3.org/2000/svg"></svg>')),
    false,
  );
  assert.equal(hasPhotoSignature(new Uint8Array()), false);
});
test("Capability checks fail closed for missing, rejecting or throwing file sharing", () => {
  assert.equal(canSharePhotos({}, [photo]), false);
  assert.equal(
    canSharePhotos(
      {
        share() {},
        canShare() {
          return true;
        },
      },
      [],
    ),
    false,
  );
  assert.equal(
    canSharePhotos(
      {
        share() {},
        canShare() {
          throw Error("blocked");
        },
      },
      [photo],
    ),
    false,
  );
  assert.equal(
    canSharePhotos(
      {
        share() {},
        canShare() {
          return false;
        },
      },
      [photo],
    ),
    false,
  );
  assert.equal(
    canSharePhotos(
      {
        share() {},
        canShare(data) {
          return data.files.length === 1;
        },
      },
      [photo],
    ),
    true,
  );
});
test("Prepared messages do not pretend photos are already attached or a request received", () => {
  const data = { brand: "Rolex", draftId: "OF-ABC12345" };
  const noPhotos = buildRequestMessage(data);
  assert.ok(noPhotos.includes("Posso aggiungere le foto"));
  const direct = buildRequestMessage(data, { photoCount: 3 });
  assert.ok(direct.includes("da allegare o condividere"));
  const shared = buildRequestMessage(data, { photoCount: 3, channel: "share" });
  assert.ok(shared.includes("Foto della richiesta: 3."));
  assert.ok(shared.includes("Riferimento bozza: OF-ABC12345"));
  assert.ok(
    !buildRequestMessage({ ...data, draftId: "<script>" }).includes("<script>"),
  );
});
