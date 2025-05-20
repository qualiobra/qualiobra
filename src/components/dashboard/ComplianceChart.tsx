
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Sample data
const data = [
  { month: 'Jan', "Estrutura": 86, "Elétrico": 92, "Hidráulico": 78, "Acabamento": 88 },
  { month: 'Fev', "Estrutura": 82, "Elétrico": 87, "Hidráulico": 81, "Acabamento": 90 },
  { month: 'Mar', "Estrutura": 89, "Elétrico": 91, "Hidráulico": 85, "Acabamento": 92 },
  { month: 'Abr', "Estrutura": 87, "Elétrico": 89, "Hidráulico": 90, "Acabamento": 87 },
  { month: 'Mai', "Estrutura": 91, "Elétrico": 94, "Hidráulico": 88, "Acabamento": 89 },
  { month: 'Jun', "Estrutura": 93, "Elétrico": 90, "Hidráulico": 84, "Acabamento": 91 },
];

const ComplianceChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" />
        <YAxis domain={[60, 100]} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
        <Tooltip 
          formatter={(value) => [`${value}%`, '']}
          labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
          contentStyle={{ 
            backgroundColor: 'white', 
            borderRadius: '8px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
            border: 'none'
          }}
        />
        <Legend />
        <Bar dataKey="Estrutura" fill="#9b87f5" radius={[4, 4, 0, 0]} barSize={20} />
        <Bar dataKey="Elétrico" fill="#7E69AB" radius={[4, 4, 0, 0]} barSize={20} />
        <Bar dataKey="Hidráulico" fill="#D6BCFA" radius={[4, 4, 0, 0]} barSize={20} />
        <Bar dataKey="Acabamento" fill="#1EAEDB" radius={[4, 4, 0, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ComplianceChart;
