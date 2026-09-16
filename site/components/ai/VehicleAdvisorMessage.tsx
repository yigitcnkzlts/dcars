import { Bot, UserRound } from "lucide-react";

type Props = { role: "user" | "assistant"; content: string };

export function VehicleAdvisorMessage({ role, content }: Props) {
  const sections = content.split("\n\n");
  return <div className={`advisor-message advisor-message--${role}`}><div className="advisor-message__icon">{role === "assistant" ? <Bot size={16} /> : <UserRound size={15} />}</div><div className="advisor-message__content">{sections.map((section, index) => { const [heading, ...body] = section.split("\n"); const hasHeading = body.length > 0 && /^[A-ZÇĞİÖŞÜ0-9 /?]+$/.test(heading); return <div className="advisor-block" key={`${section}-${index}`}>{hasHeading && <strong>{heading}</strong>}<p>{(hasHeading ? body : [section]).join("\n")}</p></div>; })}</div></div>;
}
