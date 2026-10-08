"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "@/components/layout/NativeLink";
import { ArrowUpRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const categories = {
  "Değerleme": [
    ["Başlamak için ne gerekir?", "Model yılı, marka, model, vites, yakıt, versiyon ve renk ile başlarız. Sonraki adımda kilometre, tramer ve ekspertiz bilgilerini alıyoruz."],
    ["Başvuru sonunda hemen fiyat gösterilir mi?", "Hayır. Güvenilir bir fiyat hesaplama altyapısı olmadan otomatik veya rastgele tutar göstermiyoruz. Nihai teklif araç incelemesi ve piyasa araştırması sonrasında yetkili ekibimiz tarafından belirlenir."],
    ["Başvuru satış zorunluluğu doğurur mu?", "Hayır. Başvuru bir teklif talebidir. İletilen koşulları değerlendirip kabul edip etmemek size kalır."],
    ["Formu yarıda bırakırsam ne olur?", "Araç bilgilerinin taslağı tarayıcınızda kalır. Fotoğraflar ve iletişim bilgileri gönderilene kadar yüklenmez."],
  ],
  "Ekspertiz ve hasar": [
    ["Kazalı veya boyalı araçlar alınır mı?", "Evet, başvurabilirsiniz. Bildiğiniz hasarları, tramer kaydını ve varsa ağır hasar (pert) bilgisini açıkça işaretleyin. Uygunluk incelemeden sonra netleşir."],
    ["Tramer kaydı varsa başvurabilir miyim?", "Evet. Kaydı Yok, Var veya Bilmiyorum olarak işaretleyin. Var ise bildiğiniz tutarı yazabilirsiniz."],
    ["Ağır hasar kaydı teklifi etkiler mi?", "Evet. Pert veya ağır hasar kaydı teklif sürecini etkiler. Bu bilgiyi baştan paylaşmanız daha doğru bir değerlendirme sağlar."],
    ["Fotoğraf zorunlu mu?", "Hayır. İsterseniz en fazla beş JPG, PNG veya WebP fotoğraf ekleyebilirsiniz; her biri 4 MB altında olmalıdır."],
  ],
  "Randevu ve iletişim": [
    ["Randevu Al ile Beni Arayın farkı nedir?", "Randevu Al, iletişim ve randevu tercihlerinizi bırakmanızı ister. Beni Arayın, aynı başvuruda müşteri temsilcisinin sizi aramasını tercih ettiğinizi kaydeder."],
    ["Kredi, rehin veya hacizli araçlar?", "Başvuru alabiliriz. Üzerindeki yükümlülükler satış öncesi netleştirilir; süreç inceleme sonrasında birlikte planlanır."],
    ["Trafik cezası veya vergisi olan araçlar?", "Başvuru yapılabilir. Satış öncesi bu tutarların kapanması gerekir; ihtiyaç halinde ekibimiz yönlendirme yapar."],
    ["Teklifi kabul etmek zorunda mıyım?", "Hayır. İletilen koşulları değerlendirir, uygun bulursanız satışa devam edersiniz."],
  ],
} as const;

type Category = keyof typeof categories;
const subscribeToHydration = () => () => {};

export function FaqSection() {
  const [active, setActive] = useState<Category>("Değerleme");
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  return (
    <section className="faq" aria-labelledby="faq-title">
      <div className="faq__intro">
        <span className="section-index">Sıkça sorulan sorular</span>
        <h2 id="faq-title">Değerleme sürecine dair merak edilenler</h2>
        <p>Ön değerleme, ekspertiz, fotoğraf ve randevu adımları hakkında net yanıtlar.</p>
        <Link href="/iletisim">Başka bir şey sorun <ArrowUpRight size={17} /></Link>
      </div>
      <div className="faq__content">
        <div className="faq__tabs" role="group" aria-label="Soru kategorileri">
          {(Object.keys(categories) as Category[]).map((category) => (
            <button type="button" key={category} aria-pressed={active === category} onClick={() => setActive(category)}>{category}</button>
          ))}
        </div>
        {hydrated ? (
          <Accordion key={active} type="single" collapsible defaultValue={`${active}-0`} className="faq__accordion">
            {categories[active].map(([question, answer], index) => (
              <AccordionItem value={`${active}-${index}`} key={question} className="faq__item">
                <AccordionTrigger className="faq__question"><span><small>0{index + 1}</small>{question}</span></AccordionTrigger>
                <AccordionContent className="faq__answer">{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : <div className="faq__accordion" aria-hidden="true" />}
      </div>
    </section>
  );
}
