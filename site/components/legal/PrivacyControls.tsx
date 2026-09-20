"use client";

import { useState } from "react";

const draftKeys = ["dcars-detailed-valuation-v1", "dcars-valuation-draft"];

export function PrivacyControls() {
  const [notice, setNotice] = useState("");

  const clearLocalData = () => {
    try {
      for (const key of draftKeys) localStorage.removeItem(key);
      for (let index = localStorage.length - 1; index >= 0; index--) {
        const key = localStorage.key(index);
        if (key?.startsWith("dcars-saved-")) localStorage.removeItem(key);
      }
      setNotice("Bu tarayıcıdaki form taslakları ve kaydedilen araç tercihleri silindi. Gönderilmiş başvurular etkilenmedi.");
    } catch {
      setNotice("Tarayıcı kayıtlarına erişilemedi. Tarayıcı ayarlarından site verilerini temizleyebilirsiniz.");
    }
  };

  return <section className="privacy-controls" aria-labelledby="privacy-controls-title"><h2 id="privacy-controls-title">Tarayıcıdaki verilerinizi yönetin</h2><p>Gönderilmemiş araç formu taslaklarını ve kaydedilen örnek araç tercihlerini bu cihazdan silebilirsiniz. Sunucuya gönderdiğiniz başvuruların silinmesi için ayrıca bize başvurmanız gerekir.</p><button type="button" onClick={clearLocalData}>Bu cihazdaki kayıtları temizle</button>{notice && <p role="status">{notice}</p>}</section>;
}
