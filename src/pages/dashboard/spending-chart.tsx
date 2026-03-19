import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function SpendingChart({
  data,
}: {
  data: { budgeted: number; name: string; spent: number }[];
}) {
  return (
    <div className="rounded-lg border border-ink/8 bg-white p-6">
      <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-ink-faint">
        Budget vs. Spent
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d4" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#6b6560", fontSize: 11, fontFamily: "DM Mono" }}
            axisLine={{ stroke: "#e8e0d4" }}
            tickLine={false}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={70}
          />
          <YAxis
            tick={{ fill: "#6b6560", fontSize: 11, fontFamily: "DM Mono" }}
            axisLine={{ stroke: "#e8e0d4" }}
            tickLine={false}
            tickFormatter={(v: number) => `$${v}`}
          />
          <Tooltip
            formatter={(value) => [`$${Number(value).toFixed(2)}`, undefined]}
            contentStyle={{
              backgroundColor: "#1a1714",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontFamily: "DM Mono",
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontFamily: "DM Mono", fontSize: 12 }} />
          <Bar
            dataKey="budgeted"
            fill="#e8e0d4"
            name="Budget"
            radius={[3, 3, 0, 0]}
          />
          <Bar
            dataKey="spent"
            name="Spent"
            radius={[3, 3, 0, 0]}
            fill="#c4602a"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
