import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function PassingGradeChart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="Nilai"
          fill="#82ca9d"
          activeBar={<Rectangle fill="#60f789" stroke="blue" />}
        />
        <Bar
          dataKey="KKM"
          fill="#ecbbb2"
          activeBar={<Rectangle fill="#ff856c" stroke="purple" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
