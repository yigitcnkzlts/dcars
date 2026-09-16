import { ContentPage } from "@/components/layout/ContentPage";

export default function BlogPage() {
  return <ContentPage eyebrow="D CS REHBER" title="Otomobil dünyasından doğru bilgiler." intro="Araç alırken, satarken ve otomobilinizi kullanırken daha bilinçli karar vermenize yardımcı olacak kısa rehberler." cta={{ label: "Aracınızı değerleyin", href: "/arac-degerleme" }} items={[
    { title: "İkinci el araç değerini neler belirler?", text: "Model yılı ve kilometrenin yanında donanım, bakım geçmişi, hasar kaydı, lastik durumu ve güncel talep dengesi de satış fiyatını doğrudan etkiler." },
    { title: "Ekspertiz raporunda nelere bakılmalı?", text: "Kaporta ölçümleri kadar motor, şanzıman, fren, süspansiyon ve elektronik sistem kontrollerinin de raporda açıkça yer alması gerekir." },
    { title: "Güvenli araç satışı nasıl yapılır?", text: "Alıcı doğrulaması, noter devri ve güvenli ödeme adımlarını eş zamanlı yürütmek; satış sürecindeki temel riskleri azaltır." },
    { title: "Test sürüşünü verimli kullanın", text: "Direksiyon tepkisi, fren dengesi, vites geçişleri, süspansiyon sesi ve sürüş pozisyonunu farklı yol koşullarında değerlendirin." },
  ]} />;
}
