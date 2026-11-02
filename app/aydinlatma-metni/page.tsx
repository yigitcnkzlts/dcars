import { eq } from "drizzle-orm";
import { LegalPage } from "@/components/layout/LegalPage";
import { legalDocuments } from "@/db/schema";

const fallback = [
  ["Veri sorumlusu", "D CARS markası üzerinden iletilen taleplerde veri sorumlusu işletmenin tam ticari unvanı ve tebligat adresi doğrulanarak bu metne eklenecektir. Bu sayfa, bu bilgiler tamamlanmadan nihai aydınlatma metni sayılmaz."],
  ["Toplanan bilgiler ve yöntem", "Değerleme formunda ad, soyad, telefon, e-posta, araç özellikleri, kilometre, ekspertiz beyanı ve eklediğiniz fotoğraflar elektronik ortamda alınır. Randevu talebinde tercih ettiğiniz gün ve saat de kaydedilir."],
  ["İşleme amaçları", "Bu bilgiler başvurunuzu incelemek, araç için teklif hazırlamak, sizinle iletişim kurmak, randevu planlamak ve başvuru güvenliğini sağlamak amacıyla kullanılır. Pazarlama iletişimi izni başvuru işleminden ayrıdır ve isteğe bağlıdır."],
  ["Aktarım, hukuki dayanak ve saklama", "Alıcı grupları, yurt dışına aktarım durumu, her işleme amacı için hukuki dayanak ve kayıt türü bazındaki saklama süreleri gerçek hizmet sözleşmeleri ve hukuk danışmanı değerlendirmesiyle tamamlanacaktır."],
  ["Haklarınız ve iletişim", "6698 sayılı Kanun kapsamındaki erişim, düzeltme, silme ve diğer talepleriniz için info@dcars.tr adresinden iletişime geçebilirsiniz. Gönderilmiş başvurular tarayıcı kayıtlarını temizlemekle silinmez."],
] as const;

export default async function Page() {
  let document: { title: string; version: string; content: string; validFrom: string | null } | undefined;
  try { const { getDb } = await import("@/db"); [document] = await getDb().select({ title: legalDocuments.title, version: legalDocuments.version, content: legalDocuments.content, validFrom: legalDocuments.validFrom }).from(legalDocuments).where(eq(legalDocuments.slug, "aydinlatma-metni")).limit(1); } catch { /* Static fallback remains available before migration/configuration. */ }
  const sections = document?.content.split(/\n\n+/).map((block) => { const [heading, ...body] = block.split("\n"); return [heading, body.join(" ")] as const; }).filter((section) => section[0] && section[1]) ?? fallback;
  return <LegalPage eyebrow="KVKK" title={document?.title ?? "Aydınlatma Metni"} updatedAt={document?.validFrom ?? "26 Ekim 2026"}>{sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}<p><small>Metin sürümü: {document?.version ?? "2026-10-26-taslak"}</small></p></LegalPage>;
}
