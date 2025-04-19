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

export default function PointChartBenarSalah({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data?.map((item: any) => ({
          name: item.subcategory,
          Benar: item.correct,
        }))}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" fontSize={12} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="Benar"
          fill="#82ca9d"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
