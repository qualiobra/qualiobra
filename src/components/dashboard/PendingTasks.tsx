
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample data
const tasks = [
  { 
    id: 1, 
    title: "Review electrical non-conformity report", 
    site: "Office Building B", 
    dueDate: "2023-05-20", 
    priority: "High",
    assignee: { name: "João Silva", initials: "JS", image: "" }
  },
  { 
    id: 2, 
    title: "Approve foundation inspection", 
    site: "Residential Tower A", 
    dueDate: "2023-05-21", 
    priority: "Medium",
    assignee: { name: "Maria Oliveira", initials: "MO", image: "" }
  },
  { 
    id: 3, 
    title: "Schedule follow-up for plumbing issues", 
    site: "Shopping Center C", 
    dueDate: "2023-05-22", 
    priority: "Low",
    assignee: { name: "Carlos Santos", initials: "CS", image: "" }
  },
  { 
    id: 4, 
    title: "Submit structural compliance report", 
    site: "Hotel Project D", 
    dueDate: "2023-05-23", 
    priority: "High",
    assignee: { name: "Ana Pereira", initials: "AP", image: "" }
  }
];

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "High":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>;
    case "Medium":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Medium</Badge>;
    case "Low":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
};

const PendingTasks = () => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-start p-3 hover:bg-gray-50 rounded-md cursor-pointer">
          <Avatar className="h-9 w-9 mr-3">
            <AvatarImage src={task.assignee.image} alt={task.assignee.name} />
            <AvatarFallback>{task.assignee.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <p className="font-medium text-gray-900 truncate">{task.title}</p>
              {getPriorityBadge(task.priority)}
            </div>
            <p className="text-sm text-gray-500">{task.site}</p>
            <div className="flex justify-between mt-1 text-xs">
              <span className="text-gray-400">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              <span className="text-gray-600">{task.assignee.name}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingTasks;
