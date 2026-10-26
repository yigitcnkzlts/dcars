import assert from "node:assert/strict";
import { sanitizeImage } from "../services/imageSecurity";
import { notificationText } from "../services/notificationService";
import { insufficientMessage } from "../services/vehiclePriceAnalysisService";

const png = new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,0,73,69,78,68,0,0,0,0]);
assert.equal(new Uint8Array(sanitizeImage(png.buffer, "image/png")).length, png.length);
assert.throws(() => sanitizeImage(new Uint8Array([1,2,3]).buffer, "image/jpeg"));
assert.match(notificationText.received(42), /42/);
assert.match(notificationText.offered(42), /teklif hazırlandı/i);
assert.match(insufficientMessage, /güvenilir otomatik fiyat analizi oluşturulamadı/);
console.log("Secure feature unit checks passed.");
