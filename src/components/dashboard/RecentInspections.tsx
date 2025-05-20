
import { Badge } from "@/components/ui/badge";
import { FileCheck, FileText } from "lucide-react";

// Sample data
const inspections = [
  { 
    id: 1, 
    title: "Foundation Inspection", 
    site: "Residential Tower A", 
    date: "2023-05-19", 
    status: "Approved", 
    inspector: "João Silva" 
  },
  { 
    id: 2, 
    title: "Electrical Systems", 
    site: "Office Building B", 
    date: "2023-05-18", 
    status: "Issues Found", 
    inspector: "Maria Oliveira" 
  },
  { 
    id: 3, 
    title: "Plumbing Installation", 
    site: "Residential Tower A", 
    date: "2023-05-17", 
    status: "Pending Review", 
    inspector: "Carlos Santos" 
  },
  { 
    id: 4, 
    title: "Structural Framing", 
    site: "Shopping Center C", 
    date: "2023-05-16", 
    status: "Approved", 
    inspector: "Ana Pereira" 
  },
  { 
    id: 5, 
    title: "Finishing Works", 
    site: "Hotel Project D", 
    date: "2023-05-15", 
    status: "Issues Found", 
    inspector: "Roberto Costa" 
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Approved":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
    case "Issues Found":
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Issues Found</Badge>;
    case "Pending Review":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pending Review</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const RecentInspections = () => {
  return (
    <div className="space-y-4">
      {inspections.map((inspection) => (
        <div key={inspection.id} className="flex items-start p-3 hover:bg-gray-50 rounded-md cursor-pointer">
          <div className="p-2 bg-gray-100 rounded-md mr-3">
            {inspection.status === "Approved" ? (
              <FileCheck className="h-5 w-5 text-green-500" />
            ) : (
              <FileText className="h-5 w-5 text-blue-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <p className="font-medium text-gray-900 truncate">{inspection.title}</p>
              {getStatusBadge(inspection.status)}
            </div>
            <p className="text-sm text-gray-500">{inspection.site}</p>
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>{new Date(inspection.date).toLocaleDateString()}</span>
              <span>{inspection.inspector}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentInspections;
