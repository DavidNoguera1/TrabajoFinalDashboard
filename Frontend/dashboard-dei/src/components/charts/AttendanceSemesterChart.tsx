import { GraduationCap } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AttendanceSemesterItem } from "../../types/dashboard";

interface Props {
  data: AttendanceSemesterItem[];
}

function AttendanceSemesterChart({ data }: Props) {
  const chartData = [...data]
    .sort((a, b) => Number(a.semestre_estudiante) - Number(b.semestre_estudiante))
    .map((item) => ({
      semestre: `S${item.semestre_estudiante}`,
      asistencia: Number(item.porcentaje_asistencia || 0),
      clases: Number(item.total_clases || 0),
    }));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-text-main">Asistencia por Semestre Estudiantil</h2>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 20, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="semestre"
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
              formatter={(value) => [`${Number(value).toFixed(2)}%`, "Asistencia"]}
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
            <Line
              type="monotone"
              dataKey="asistencia"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ fill: "#16a34a", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AttendanceSemesterChart;
