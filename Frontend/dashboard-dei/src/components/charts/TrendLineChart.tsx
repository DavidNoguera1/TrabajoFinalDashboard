import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AttendanceTrendItem } from "../../types/dashboard";

interface Props {
  data: AttendanceTrendItem[];
}

function TrendLineChart({ data }: Props) {
  const formattedData = data.map((item) => ({
    mes: new Date(item.mes).toLocaleDateString("es-CO", { month: "short" }),
    asistencia: Number(item.porcentaje_asistencia),
  }));

  const validAttendance = formattedData
    .map((item) => item.asistencia)
    .filter((value) => Number.isFinite(value));

  const avgAttendance =
    validAttendance.length > 0
      ? (
          validAttendance.reduce((sum, current) => sum + current, 0) / validAttendance.length
        ).toFixed(2)
      : "0.00";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-text-main">Tendencia de Asistencia</h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted">Promedio</p>
          <p className="text-2xl font-bold text-primary">{avgAttendance}%</p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="mes"
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
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "8px",
                color: "#1e293b",
              }}
              formatter={(value) =>
                typeof value === "number" ? `${value.toFixed(2)}%` : String(value)
              }
              cursor={{ stroke: "#3b82f6", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="asistencia"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 5 }}
              activeDot={{ r: 7 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TrendLineChart;
