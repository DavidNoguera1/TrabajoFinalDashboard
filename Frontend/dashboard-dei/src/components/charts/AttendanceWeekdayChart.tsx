import { CalendarDays } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AttendanceWeekdayItem } from "../../types/dashboard";

interface Props {
  data: AttendanceWeekdayItem[];
}

const labels: Record<number, string> = {
  0: "Dom",
  1: "Lun",
  2: "Mar",
  3: "Mié",
  4: "Jue",
  5: "Vie",
  6: "Sáb",
};

function AttendanceWeekdayChart({ data }: Props) {
  const chartData = [...data]
    .sort((a, b) => Number(a.dia_semana_num) - Number(b.dia_semana_num))
    .map((item) => ({
      dia: labels[Number(item.dia_semana_num)] || String(item.dia_semana),
      asistencia: Number(item.porcentaje_asistencia || 0),
      clases: Number(item.total_clases || 0),
    }));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-text-main">Asistencia por Día de Semana</h2>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 20, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="dia"
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "asistencia") return [`${Number(value).toFixed(2)}%`, "Asistencia"];
                return [value, name];
              }}
              labelFormatter={(label, payload) =>
                payload?.[0]?.payload ? `${label} (${payload[0].payload.clases} clases)` : String(label)
              }
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "8px",
                color: "#1e293b",
              }}
            />
            <Bar dataKey="asistencia" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`weekday-${index}`} fill={index % 2 === 0 ? "#2563eb" : "#0ea5e9"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AttendanceWeekdayChart;
