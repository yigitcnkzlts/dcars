"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

const consentKey = "dcars-analytics-consent";
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function Analytics() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => null);
  if (consent !== "accepted") return null;
  return <>
    {gaId ? <><Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" /><Script id="dcars-ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}</Script></> : null}
    {pixelId ? <Script id="dcars-meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}</Script> : null}
  </>;
}

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => "rejected");
  const choose = (value: "accepted" | "rejected") => {
    localStorage.setItem(consentKey, value);
    window.dispatchEvent(new Event("dcars:consent"));
  };
  if (consent) return null;
  return <aside className="cookie-consent" aria-label="Çerez tercihi"><p>Site performansını ve reklam dönüşümlerini ölçmek için isteğe bağlı analiz çerezleri kullanabiliriz. <a href="/cerez-politikasi">Detayları inceleyin.</a></p><div><button type="button" onClick={() => choose("rejected")}>Reddet</button><button type="button" onClick={() => choose("accepted")}>Kabul et</button></div></aside>;
}

function subscribe(callback: () => void) { window.addEventListener("dcars:consent", callback); return () => window.removeEventListener("dcars:consent", callback); }
function readConsent() { return localStorage.getItem(consentKey) as "accepted" | "rejected" | null; }
