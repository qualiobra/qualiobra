
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Sample data
const data = [
  { month: 'Jan', "Structure": 86, "Electrical": 92, "Plumbing": 78, "Finishing": 88 },
  { month: 'Feb', "Structure": 82, "Electrical": 87, "Plumbing": 81, "Finishing": 90 },
  { month: 'Mar', "Structure": 89, "Electrical": 91, "Plumbing": 85, "Finishing": 92 },
  { month: 'Apr', "Structure": 87, "Electrical": 89, "Plumbing": 90, "Finishing": 87 },
  { month: 'May', "Structure": 91, "Electrical": 94, "Plumbing": 88, "Finishing": 89 },
  { month: 'Jun', "Structure": 93, "Electrical": 90, "Plumbing": 84, "Finishing": 91 },
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
        <Bar dataKey="Structure" fill="#9b87f5" radius={[4, 4, 0, 0]} barSize={20} />
        <Bar dataKey="Electrical" fill="#7E69AB" radius={[4, 4, 0, 0]} barSize={20} />
        <Bar dataKey="Plumbing" fill="#D6BCFA" radius={[4, 4, 0, 0]} barSize={20} />
        <Bar dataKey="Finishing" fill="#1EAEDB" radius={[4, 4, 0, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ComplianceChart;
