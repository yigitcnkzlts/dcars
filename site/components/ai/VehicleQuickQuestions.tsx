const questions = ["Clio üç kişilik aileye uygun mu?", "Tucson'un motoru ve tüketimi nasıl?", "Şehir içinde hangi araç daha mantıklı?", "İkinci elde nelere bakmalıyım?"];

export function VehicleQuickQuestions({ onSelect, disabled }: { onSelect: (question: string) => void; disabled?: boolean }) {
  return <div className="advisor-suggestions">{questions.map((question) => <button type="button" key={question} onClick={() => onSelect(question)} disabled={disabled}>{question}</button>)}</div>;
}
