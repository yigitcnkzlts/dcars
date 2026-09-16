"use client";

import { useState } from "react";
import Link from "@/components/layout/NativeLink";
import { ArrowUpRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const categories = {
  "Teklif başvurusu": [
    ["Başlamak için ne gerekir?", "Model yılı, marka, model ve kilometre yeterli. Sonraki adımlarda aracın durumunu ve iletişim bilgilerini eklersin."],
    ["Başvuru yapmak satış zorunluluğu doğurur mu?", "Hayır. Başvuru bir teklif talebidir; teklif iletildiğinde kabul edip etmemek sana kalır."],
    ["Formu yarıda bırakırsam bilgilerim kaybolur mu?", "Araç bilgilerinin taslağı kullandığın tarayıcıda kalır. Fotoğraflar ve iletişim bilgileri gönderene kadar yüklenmez veya taslağa kaydedilmez."],
  ],
  "Fotoğraflar ve hasar": [
    ["Aracım kazalıysa başvurabilir miyim?", "Evet, bildiğin hasarları yazıp ilgili bölgenin fotoğraflarını ekleyebilirsin. Uygunluk ve teklif incelemeden sonra netleşir."],
    ["Hangi fotoğrafları eklemeliyim?", "Ön, arka, yanlar ve varsa hasarlı bölgeyi gün ışığında, net olarak çek. En fazla beş JPG, PNG veya WebP fotoğrafı ekleyebilirsin."],
    ["Fotoğraf eklemek zorunlu mu?", "Hayır. Ancak fotoğraflar aracın durumunu ilk aşamada daha iyi anlamamıza yardımcı olur."],
  ],
  "Satış ve iletişim": [
    ["Gönderdikten sonra ne olur?", "Başvurun kaydedilir ve bir numara gösterilir. Ekip, belirttiğin iletişim bilgileri ve uygun zaman tercihine göre dönüş yapar."],
    ["Beklediğim fiyatı yazmalı mıyım?", "İsteğe bağlıdır. Yazdığın tutar bağlayıcı değildir; teklif araç bilgileri ve durum doğrulandıktan sonra iletilir."],
    ["Teklifi kabul etmek zorunda mıyım?", "Hayır. İletilen koşulları değerlendirir, uygun bulursan satışa devam edersin."],
  ],
} as const;

type Category = keyof typeof categories;

export function FaqSection() {
  const [active, setActive] = useState<Category>("Teklif başvurusu");
  return <section className="faq" aria-labelledby="faq-title"><div className="faq__intro"><span className="section-index">BİLGİ MERKEZİ</span><h2 id="faq-title">Sıkça sorulan<br /><em>sorular.</em></h2><p>Teklif talebi, hasar fotoğrafları ve satış adımları hakkında kısa yanıtlar.</p><Link href="/iletisim">Başka bir şey sorun <ArrowUpRight size={17} /></Link></div><div className="faq__content"><div className="faq__tabs" role="group" aria-label="Soru kategorileri">{(Object.keys(categories) as Category[]).map((category) => <button type="button" key={category} aria-pressed={active === category} onClick={() => setActive(category)}>{category}</button>)}</div><Accordion key={active} type="single" collapsible defaultValue={`${active}-0`} className="faq__accordion">{categories[active].map(([question, answer], index) => <AccordionItem value={`${active}-${index}`} key={question} className="faq__item"><AccordionTrigger className="faq__question"><span><small>0{index + 1}</small>{question}</span></AccordionTrigger><AccordionContent className="faq__answer">{answer}</AccordionContent></AccordionItem>)}</Accordion></div></section>;
}
