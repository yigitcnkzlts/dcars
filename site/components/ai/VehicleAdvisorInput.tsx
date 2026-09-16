"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

export function VehicleAdvisorInput({ onSubmit, disabled }: { onSubmit: (message: string) => void; disabled?: boolean }) {
  const [message, setMessage] = useState("");
  const submit = () => { if (!message.trim() || disabled) return; onSubmit(message.trim()); setMessage(""); };
  return <div className="advisor-input"><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} placeholder="Örneğin: Boyalı aracımı satabilir miyim?" aria-label="Dijital satış danışmanına soru yazın" /><button type="button" onClick={submit} disabled={disabled || !message.trim()}>Sor <ArrowUpRight size={16} /></button></div>;
}
