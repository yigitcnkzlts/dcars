"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

const consentKey = "dcars-analytics-consent";
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function Analytics() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => null);
  if (!consent?.analytics) return null;
  return <>
    {gaId ? <><Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" /><Script id="dcars-ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}</Script></> : null}
    {pixelId ? <Script id="dcars-meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}</Script> : null}
  </>;
}

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => ({ necessary: true, analytics: false, marketing: false }));
  const choose = (analytics: boolean, marketing: boolean) => {
    localStorage.setItem(consentKey, JSON.stringify({ necessary: true, analytics, marketing, updatedAt: new Date().toISOString() }));
    window.dispatchEvent(new Event("dcars:consent"));
  };
  if (consent) return null;
  return <aside className="cookie-consent" aria-label="Çerez tercihi"><p>Zorunlu depolama her zaman aktiftir. Analiz ve pazarlama kategorileri yalnızca izninizle etkinleşir. <a href="/cerez-politikasi">Detayları inceleyin.</a></p><div><button type="button" onClick={() => choose(false, false)}>Yalnızca zorunlu</button><button type="button" onClick={() => choose(true, false)}>Analize izin ver</button><button type="button" onClick={() => choose(true, true)}>Tümüne izin ver</button></div></aside>;
}

function subscribe(callback: () => void) { window.addEventListener("dcars:consent", callback); return () => window.removeEventListener("dcars:consent", callback); }
function readConsent(): { necessary: true; analytics: boolean; marketing: boolean } | null { const raw = localStorage.getItem(consentKey); if (!raw) return null; if (raw === "accepted") return { necessary: true, analytics: true, marketing: true }; if (raw === "rejected") return { necessary: true, analytics: false, marketing: false }; try { const parsed = JSON.parse(raw) as { analytics?: boolean; marketing?: boolean }; return { necessary: true, analytics: parsed.analytics === true, marketing: parsed.marketing === true }; } catch { return null; } }
