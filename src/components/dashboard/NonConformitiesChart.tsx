
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Sample data
const data = [
  { name: 'Critical', value: 8, color: '#F97316' },
  { name: 'Major', value: 15, color: '#FEC6A1' },
  { name: 'Minor', value: 19, color: '#D3E4FD' },
];

const statusData = [
  { name: 'Open', value: 24, color: '#F97316' },
  { name: 'In Progress', value: 12, color: '#FEC6A1' },
  { name: 'Resolved', value: 6, color: '#9b87f5' },
];

const NonConformitiesChart = () => {
  return (
    <div className="grid grid-cols-2 h-full">
      <div>
        <h4 className="text-sm font-medium mb-3 text-center">By Severity</h4>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value} issues`, name]}
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                border: 'none'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-3 text-center">By Status</h4>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value} issues`, name]}
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                border: 'none'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NonConformitiesChart;
