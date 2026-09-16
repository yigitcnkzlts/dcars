import { Navbar } from "@/components/layout/Navbar";
import { ValuationExperience } from "@/components/valuation/ValuationExperience";

export default function ValuationPage() { return <><Navbar /><main className="standalone-flow valuation-page"><header><span>ARACIMI DEĞERLE</span><h1>Aracını kolayca sat.</h1><p>Marka ve modelini seçerek başla. Aracının durumunu anlattıktan sonra teklif için seninle iletişime geçelim.</p></header><ValuationExperience /></main></>; }
