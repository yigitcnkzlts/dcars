import Link from "@/components/layout/NativeLink";
import { ArrowUpRight, MessageCircle, ShieldCheck } from "lucide-react";

export const faqCategories = {
  "Başvuru ve araç bilgileri": [
    ["Araç değerleme başvurusu için hangi bilgiler gerekir?", "Model yılı, marka, model ve kilometre bilgisiyle başlayabilirsiniz. Hasar kaydı, değişen veya boyalı parçalar ve donanım bilgileri teklifin daha sağlıklı hazırlanmasına yardımcı olur."],
    ["Fotoğraf yüklemek zorunlu mu?", "Hayır. Fotoğraf eklemek isteğe bağlıdır; ancak aracın dışı, içi ve varsa kusurlarını gösteren güncel fotoğraflar ilk değerlendirmeyi kolaylaştırır."],
    ["Formu yarıda bırakırsam bilgilerim kaybolur mu?", "Araç taslağı cihazınızda saklanır. Ad ve telefonunuzu “Taslağı kaydet” seçeneğiyle iletirseniz ekibimiz başvuruyu tamamlamanız için size ulaşabilir."],
    ["Şirket veya filo araçları için de başvuru yapabilir miyim?", "Evet. Birden fazla araç için iletişim formundan filo bilgilerinizi paylaşabilirsiniz. Evrak ve değerlendirme süreci araç sayısına göre birlikte planlanır."],
    ["Her marka, model ve yaştaki araç için teklif alabilir miyim?", "Başvuru oluşturabilirsiniz. Aracın yaşı, kondisyonu, kilometresi ve hizmet bölgesi incelendikten sonra teklif verilip verilemeyeceği uzmanımız tarafından netleştirilir."],
  ],
  "Teklif ve ekspertiz": [
    ["Başvuru sonunda hemen fiyat gösterilir mi?", "Hayır. Teklif; paylaştığınız araç bilgileri, aracın kondisyonu ve güncel piyasa verileri uzman tarafından incelendikten sonra hazırlanır."],
    ["Teklif nasıl belirleniyor?", "Marka, model, model yılı, kilometre, donanım, hasar geçmişi, mekanik ve kozmetik durum ile güncel piyasa koşulları birlikte değerlendirilir."],
    ["İlk teklif ile ekspertiz sonrası fiyat değişebilir mi?", "Evet. Beyan edilen bilgiler ile ekspertiz sonucu arasında fark bulunursa teklif güncellenebilir. Değişikliğin nedeni satış kararı vermeden önce sizinle paylaşılır."],
    ["Ekspertiz nerede yapılır ve ücretini kim öder?", "Ekspertiz noktası, randevu zamanı ve varsa ücret sorumluluğu işlemden önce açıkça bildirilir. Onayınız olmadan ücretli bir işlem başlatılmaz."],
    ["Teklif ne kadar süre geçerli?", "Piyasa koşulları değişebildiği için teklifin geçerlilik süresi size teklif iletilirken belirtilir. Süre geçerse güncel koşullara göre yeniden değerlendirme yapılabilir."],
  ],
  "Ödeme ve noter": [
    ["Ödeme ne zaman ve nasıl yapılır?", "Ödeme yöntemi ve zamanı, araç incelemesi tamamlanıp teklif kabul edildikten sonra satış temsilcisiyle yazılı olarak netleştirilir."],
    ["Noter işlemleri nasıl yürütülür?", "Devir tarihi, noter adımları ve gerekli belgeler teklif kabulünden sonra birlikte planlanır. Masraf paylaşımı işlem öncesinde size bildirilir."],
    ["Kredi, rehin veya hacizli araçlar için başvuru yapılabilir mi?", "Evet. Araç üzerindeki yükümlülükler satıştan önce doğrulanır; kapatma ve devir süreci ilgili banka veya kurumun koşullarına göre planlanır."],
    ["Araç sahibi dışında biri satış işlemini yapabilir mi?", "Noter satışını ruhsat sahibi veya geçerli satış yetkisi bulunan vekil gerçekleştirebilir. Vekâletnamenin kapsamı işlem öncesinde kontrol edilir."],
    ["Satış için hangi belgeler gerekli?", "Genellikle kimlik, ruhsat ve duruma göre vekâletname veya şirket evrakları gerekir. Aracınıza özel kesin belge listesi randevu öncesinde paylaşılır."],
  ],
  "Süreç ve güven": [
    ["Başvurudan sonra ne kadar sürede dönüş yapılır?", "Başvurunuz ekibimize ulaştığında mümkün olan en kısa sürede tercih ettiğiniz iletişim kanalından dönüş yapılır. Yoğunluk ve çalışma saatleri süreyi etkileyebilir."],
    ["Başvuru veya teklif satış zorunluluğu doğurur mu?", "Hayır. Başvuru ve teklif bağlayıcı değildir; teklifi kabul edip etmemek tamamen size kalır."],
    ["Kişisel bilgilerim güvende mi?", "Bilgileriniz başvurunuzu değerlendirmek ve sizinle iletişim kurmak amacıyla, ilgili aydınlatma metni ve gizlilik politikası kapsamında işlenir."],
    ["Hangi şehirlerde hizmet veriliyor?", "Hizmet kapsamı dönemsel olarak değişebilir. Şehir bilginizi başvuruda paylaşmanızın ardından güncel hizmet durumu ekibimiz tarafından doğrulanır."],
    ["Aracımı satmaktan vazgeçersem ne olur?", "Noter devri tamamlanana kadar satış kararınızı yeniden değerlendirebilirsiniz. Devam eden bir randevunuz varsa ekibimize bilgi vermeniz yeterlidir."],
  ],
} as const;

const questionCount = Object.values(faqCategories).reduce((total, questions) => total + questions.length, 0);

export function FaqSection() {
  return (
    <section className="faq" aria-labelledby="faq-title">
      <div className="faq__intro">
        <span className="section-index">Sıkça sorulan sorular</span>
        <h2 id="faq-title">Aklınızdaki sorulara <em>net yanıtlar</em></h2>
        <p>Başvurudan noter devrine kadar araç satış sürecinin her adımını şeffaf biçimde öğrenin.</p>
        <div className="faq__highlights" aria-label="SSS özeti">
          <span><strong>{questionCount}</strong> yanıt</span>
          <span><ShieldCheck size={16} /> Şeffaf süreç</span>
        </div>
        <div className="faq__contact-card">
          <MessageCircle size={22} aria-hidden="true" />
          <div><strong>Aradığınız yanıtı bulamadınız mı?</strong><span>Ekibimiz size yardımcı olsun.</span></div>
          <Link href="/iletisim" aria-label="İletişim sayfasına git"><ArrowUpRight size={18} /></Link>
        </div>
      </div>

      <div className="faq__content faq__server-list">
        {Object.entries(faqCategories).map(([category, questions], categoryIndex) => (
          <section key={category} className="faq__group">
            <div className="faq__group-heading"><span>0{categoryIndex + 1}</span><h3>{category}</h3><small>{questions.length} soru</small></div>
            {questions.map(([question, answer], index) => (
              <details key={question} open={categoryIndex === 0 && index === 0}>
                <summary><span>{question}</span><i aria-hidden="true" /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </section>
        ))}
      </div>
    </section>
  );
}
