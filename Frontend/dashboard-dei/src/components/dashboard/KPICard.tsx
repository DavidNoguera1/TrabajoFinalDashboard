interface Props{
    title: string;
    value: string;
}

export default function KPICard({title, value}: Props) {
  return (
    <div className="rounded-2xl bg-surface p-6 shadow-sm border border-slate-800 hover:border-blue-500/30 transition-colors">
        <h3 className="text-text-muted">{title}</h3>
        <p className="mt-3 text-4xl font-bold text-text-main">
            {value}
        </p>
    </div>
  )
}
