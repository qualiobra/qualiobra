
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, ClipboardCheck, Gauge, MessageSquare, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const handleDemoClick = () => {
    toast({
      title: "Demo Started",
      description: "Welcome to QualiObra! Explore the features of our platform.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="rounded-full bg-primary w-10 h-10 flex items-center justify-center mr-3">
              <ClipboardCheck className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">QualiObra</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium">Home</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-primary font-medium">Dashboard</Link>
            <Link to="/inspections" className="text-gray-700 hover:text-primary font-medium">Inspections</Link>
            <Link to="/team" className="text-gray-700 hover:text-primary font-medium">Team</Link>
          </nav>
          <Button onClick={handleDemoClick}>Try Demo</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Simplify Construction Quality Management
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              QualiObra helps construction teams automate inspections, track compliance, 
              and engage team members while meeting ISO and PBQP-H standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="font-medium">
                Get Started <ArrowRight className="ml-2" size={18} />
              </Button>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="font-medium">
                  View Demo Dashboard
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80" 
              alt="Construction site" 
              className="rounded-lg w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ClipboardCheck size={24} />}
              title="Standardized Inspections"
              description="Pre-built and customizable checklists that ensure consistent quality inspections across all job sites."
            />
            <FeatureCard 
              icon={<Gauge size={24} />}
              title="Real-time Dashboards"
              description="Interactive metrics for compliance, non-conformities, and productivity with detailed filtering options."
            />
            <FeatureCard 
              icon={<Users size={24} />}
              title="Team Engagement"
              description="Gamification with points, leaderboards, and rewards to drive participation and improvement."
            />
            <FeatureCard 
              icon={<MessageSquare size={24} />}
              title="WhatsApp Notifications"
              description="Automatic alerts and reminders for pending tasks or new inspections via WhatsApp."
            />
            <FeatureCard 
              icon={<MessageSquare size={24} />}
              title="AI Assistant"
              description="Get answers to standards questions and generate automated reports with our AI chatbot."
            />
            <FeatureCard 
              icon={<ClipboardCheck size={24} />}
              title="Comprehensive Records"
              description="Centralized database with complete inspection history and evidence including photos and notes."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-primary/10 rounded-xl p-8 md:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Ready to improve quality management?</h3>
            <p className="text-lg mb-8">
              Join other construction companies already using QualiObra to enhance compliance, 
              team engagement, and project outcomes.
            </p>
            <Button size="lg" className="font-medium">
              Start Your Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <div className="rounded-full bg-white w-10 h-10 flex items-center justify-center mr-3">
                  <ClipboardCheck className="text-primary" size={20} />
                </div>
                <h2 className="text-xl font-bold">QualiObra</h2>
              </div>
              <p className="mt-4 max-w-md text-gray-400">
                Construction quality management platform for ISO and PBQP-H compliance.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-medium mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Case Studies</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Guides</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} QualiObra. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-lg mb-4">
      <div className="text-primary">{icon}</div>
    </div>
    <h4 className="text-xl font-semibold mb-2">{title}</h4>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Index;
