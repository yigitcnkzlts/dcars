const questions = ["Kazalı aracımı satabilir miyim?", "Hangi fotoğrafları eklemeliyim?", "Teklif nasıl belirlenir?", "Hangi belgeler gerekir?", "Teklifi kabul etmek zorunda mıyım?"];

export function VehicleQuickQuestions({ onSelect, disabled }: { onSelect: (question: string) => void; disabled?: boolean }) {
  return <div className="advisor-suggestions">{questions.map((question) => <button type="button" key={question} onClick={() => onSelect(question)} disabled={disabled}>{question}</button>)}</div>;
}
