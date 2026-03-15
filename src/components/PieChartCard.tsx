import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ChartEntry } from '../utils/chartUtils';

const COLORS = [
  '#f85149', '#ff7b72', '#ffa657', '#e3b341',
  '#7ee787', '#39d353', '#388bfd', '#79c0ff',
  '#d2a8ff', '#f0883e', '#56d364', '#58a6ff',
];

interface Props {
  title: string;
  total: number;
  entries: ChartEntry[];
}

export function PieChartCard({ title, total, entries }: Props) {
  return (
    <div className="pie-card">
      <div className="pie-card__header">
        <span className="pie-card__title">{title}</span>
        <span className="pie-card__total">{total.toLocaleString()} 件</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={entries}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} (${((percent ?? 0) * 100).toFixed(1)}%)`
            }
            labelLine={false}
          >
            {entries.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number | undefined) => [
              `${(value ?? 0).toLocaleString()} 件 (${(((value ?? 0) / total) * 100).toFixed(1)}%)`,
            ]}
            contentStyle={{
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              fontSize: '0.8rem',
              color: 'var(--text)',
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: 'var(--text)', fontSize: '0.78rem' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
