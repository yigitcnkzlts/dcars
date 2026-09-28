import { Navbar } from "@/components/layout/Navbar";
import { ValuationExperience } from "@/components/valuation/ValuationExperience";
import "./valuation.css";

export default function ValuationPage() { return <><Navbar /><main className="standalone-flow valuation-page"><header><div><span>D CARS · ARACIMI DEĞERLE</span><h1>Yeni bir yolculuğa, kolay bir başlangıç.</h1><p>Aracınızı seçin, durumunu paylaşın. Satışın sonraki adımını birlikte planlayalım.</p></div><span className="valuation-header-note">Ücretsiz başvuru<br /><b>Satış zorunluluğu yok</b></span></header><ValuationExperience /></main></>; }
