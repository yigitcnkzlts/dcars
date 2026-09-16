import type { AdvisorResponse } from "@/types/ai";
import type { VehicleContext } from "@/types/vehicle";

type SellerProfile = { saleTiming?: string; accidentStatus?: string; damageArea?: string };
const suggestions = ["Hasarı nasıl anlatmalıyım?", "Hangi fotoğrafları eklemeliyim?", "Tekliften sonra ne olur?"];

export function buildVehicleLabel(vehicle?: VehicleContext) {
  return [vehicle?.year, vehicle?.brand, vehicle?.model].filter(Boolean).join(" ") || "Aracınız";
}

export async function answerVehicleQuestion(message: string, vehicle?: VehicleContext, profile?: SellerProfile): Promise<AdvisorResponse> {
  const question = message.toLocaleLowerCase("tr-TR");
  const label = buildVehicleLabel(vehicle);
  let answer: string;
  if (/fotoğraf|görsel|resim|çekim/.test(question)) answer = "FOTOĞRAF REHBERİ\nAracın ön, arka ve iki yanından gün ışığında net kareler çekin. Hasar varsa önce bölgeyi bütünüyle, sonra hasarı yakından gösterin. Plaka veya kişisel belge görünüyorsa göndermeden önce kontrol edin. Başvuruda en fazla beş fotoğraf ekleyebilirsiniz.";
  else if (/kaza|hasar|boya|değişen|tramer/.test(question)) answer = `HASARLI ARAÇ BAŞVURUSU\n${label} için bildiğiniz kaza, boya, değişen parça ve tramer bilgilerini açıkça yazın. ${profile?.damageArea ? `${profile.damageArea} bölgesini fotoğraflayın. ` : "Hasarlı bölgeyi fotoğraflayın. "}Hasarlı araçlar da başvuru yapabilir; uygunluk ve teklif araç incelendikten sonra netleşir.`;
  else if (/belge|ruhsat|noter|ödeme|devir/.test(question)) answer = "SATIŞA HAZIRLIK\nGörüşmeye ruhsat, kimlik, yedek anahtar ve varsa bakım kayıtlarıyla hazırlanmak işleri kolaylaştırır. Noter devri, ödeme yöntemi ve teslim zamanı teklif kabul edildikten sonra birlikte netleştirilmelidir.";
  else if (/kabul|zorunda|vazgeç|karar/.test(question)) answer = "KARAR SİZDE\nTeklif talebi göndermek aracı satma zorunluluğu doğurmaz. Araç incelendikten sonra iletilen koşulları değerlendirip kabul edip etmeyeceğinize siz karar verirsiniz.";
  else if (/teklif|fiyat|değer|ne kadar|sat/.test(question)) answer = `TEKLİF NASIL OLUŞUR?\n${label} için yıl, kilometre, donanım, bakım ve hasar geçmişi ile fiziksel durum birlikte incelenir. Başvuruda yazdığınız hedef fiyat beklentinizi anlamaya yarar; kesin teklif değildir. Bu danışman canlı piyasa verisi veya anlık teklif üretmez.`;
  else answer = "BAŞVURUDA İŞİNİZE YARAYACAKLAR\nYıl, marka, model ve kilometreyle başlayın. Araç durumunu dürüstçe anlatın; kaza veya boya varsa ilgili bölgenin fotoğrafını ekleyin. Satmak istediğiniz zamanı ve iletişim tercihinizi belirtin.";
  const profileLine = [profile?.saleTiming && `Satış zamanı: ${profile.saleTiming}`, profile?.accidentStatus && `Hasar: ${profile.accidentStatus}`, profile?.damageArea && `Bölge: ${profile.damageArea}`].filter(Boolean).join(" · ");
  return { answer: `${answer}${profileLine ? `\n\nPAYLAŞTIĞINIZ BİLGİLER\n${profileLine}` : ""}\n\nBu yanıt genel rehberdir; araç uygunluğu ve teklif incelemeden sonra doğrulanır.`, suggestions };
}
