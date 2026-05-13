import { BarChart2 } from "lucide-react";

interface Props {
  message?: string;
}

export default function EmptyState({ message = "Sin datos disponibles" }: Props) {
  return (
    <div className="flex h-48 flex-col items-center justify-center gap-2 text-slate-300">
      <BarChart2 className="h-10 w-10" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
