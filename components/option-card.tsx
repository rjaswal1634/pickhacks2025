// components/option-card.jsx
import { cn } from "@/lib/utils"

interface OptionCardProps {
  title: string;
  selected: boolean;
  onClick: () => void;
  instruction?: string;
  size?: "default" | "small";
}

export default function OptionCard({ title, selected, onClick, instruction, size = "default" }: OptionCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white/10 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-white/20",
        selected && "bg-gradient-to-r from-pink-500 to-purple-500",
        size === "small" ? "text-sm" : "text-lg",
      )}
    >
      <h3 className="font-semibold text-white">{title}</h3>
      {instruction && <p className="text-white/70 text-xs mt-1">{instruction}</p>}
    </div>
  )
}