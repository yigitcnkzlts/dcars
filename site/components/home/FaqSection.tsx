import Link from "@/components/layout/NativeLink";
import { ArrowUpRight } from "lucide-react";

const categories = {
  "Teklif süreci": [
    ["Başlamak için ne gerekir?", "Model yılı, marka, model ve kilometreyle başlayabilirsiniz. Bildiğiniz ekspertiz ve hasar detaylarını sonraki adımda eklersiniz."],
    ["Başvuru sonunda hemen fiyat gösterilir mi?", "Hayır. Teklif, araç bilgileri ve güncel piyasa koşulları uzman tarafından incelendikten sonra hazırlanır."],
    ["Başvuru satış zorunluluğu doğurur mu?", "Hayır. Teklifi değerlendirip kabul edip etmemek tamamen size kalır."],
    ["Formu yarıda bırakırsam ne olur?", "Araç taslağı cihazınızda saklanır. Ad ve telefonunuzu Taslağı kaydet düğmesiyle iletirseniz ekibimiz başvuruyu tamamlamanız için size ulaşabilir."],
  ],
  "Ödeme ve noter": [
    ["Ödeme ne zaman ve nasıl yapılır?", "Ödeme yöntemi ve zamanı, araç incelemesi ve teklif kabulünden sonra satış temsilcisiyle yazılı olarak netleştirilir."],
    ["Noter işlemleri nasıl yürütülür?", "Devir zamanı ve noter adımları teklif kabulünden sonra birlikte planlanır. Kesin masraf paylaşımı görüşmede bildirilir."],
    ["Kredi, rehin veya hacizli araçlar için başvuru yapılabilir mi?", "Evet. Araç üzerindeki yükümlülükler satıştan önce doğrulanır ve kapatma süreci ilgili kurumun koşullarına göre planlanır."],
    ["Ekspertiz ücretini kim öder?", "Ekspertiz yeri ve ücret sorumluluğu randevu oluşturulurken açıkça bildirilir; onayınız olmadan ücretli işlem başlatılmaz."],
  ],
  "Hizmet ve iletişim": [
    ["Hangi şehirlerde hizmet veriliyor?", "Güncel hizmet bölgesini başvuru sırasında şehir bilginize göre ekibimiz doğrular."],
    ["Ne kadar sürede aranırım?", "Başvurunuzun ardından uzmanımız sizi 10 dakika içinde tercih ettiğiniz iletişim yöntemiyle arar."],
    ["Fotoğraf zorunlu mu?", "Hayır. Fotoğraf eklemek isteğe bağlıdır; aracın ilk incelemesini kolaylaştırır."],
    ["Teklifi kabul etmek zorunda mıyım?", "Hayır. Teklif bağlayıcı değildir ve karar size aittir."],
  ],
} as const;

export function FaqSection() {
  return <section className="faq" aria-labelledby="faq-title"><div className="faq__intro"><span className="section-index">Sıkça sorulan sorular</span><h2 id="faq-title">Teklif ve satış sürecine dair net yanıtlar</h2><p>Ödeme, noter, ekspertiz ve iletişim adımlarını baştan öğrenin.</p><Link href="/iletisim">Başka bir şey sorun <ArrowUpRight size={17} /></Link></div><div className="faq__content faq__server-list">{Object.entries(categories).map(([category, questions]) => <section key={category}><h3>{category}</h3>{questions.map(([question, answer], index) => <details key={question} open={index === 0}><summary><small>0{index + 1}</small>{question}</summary><p>{answer}</p></details>)}</section>)}</div></section>;
}
