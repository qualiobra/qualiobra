
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Gauge, ClipboardCheck, Users, TrendingUp, TrendingDown, Bell } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ComplianceChart from "@/components/dashboard/ComplianceChart";
import NonConformitiesChart from "@/components/dashboard/NonConformitiesChart";
import RecentInspections from "@/components/dashboard/RecentInspections";
import PendingTasks from "@/components/dashboard/PendingTasks";
import SiteHeader from "@/components/layout/SiteHeader";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      
      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome to QualiObra Dashboard</DialogTitle>
            <DialogDescription>
              Here you can monitor quality metrics, track inspections, and manage your teams across all construction sites.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <p>New features available:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Improved inspection forms with photo upload capability</li>
              <li>WhatsApp notifications for urgent non-conformities</li>
              <li>Team performance metrics and leaderboards</li>
            </ul>
            <Button onClick={() => setShowWelcome(false)} className="w-full">
              Get Started
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quality Dashboard</h1>
          <p className="text-gray-600">Monitor quality metrics across all your construction projects</p>
        </div>
        
        {/* Dashboard Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview">
              <Gauge className="mr-2 h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="inspections">
              <ClipboardCheck className="mr-2 h-4 w-4" /> Inspections
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="mr-2 h-4 w-4" /> Team
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" /> Notifications
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Inspections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">324</div>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      <span className="text-xs font-medium">+12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Compliance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">88%</div>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      <span className="text-xs font-medium">+3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Non-Conformities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">42</div>
                    <div className="flex items-center text-red-500">
                      <TrendingDown className="mr-1 h-4 w-4" />
                      <span className="text-xs font-medium">-8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Pending Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">16</div>
                    <div className="flex items-center text-amber-500">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      <span className="text-xs font-medium">+2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Compliance Metrics</CardTitle>
                  <CardDescription>Monthly compliance by category</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ComplianceChart />
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Non-Conformities</CardTitle>
                  <CardDescription>Issues by severity and status</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <NonConformitiesChart />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity and Pending Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Inspections</CardTitle>
                  <CardDescription>Last 5 inspections across all sites</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentInspections />
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Pending Tasks</CardTitle>
                  <CardDescription>Tasks requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <PendingTasks />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inspections Tab */}
          <TabsContent value="inspections">
            <Card>
              <CardHeader>
                <CardTitle>Inspections</CardTitle>
                <CardDescription>Manage all inspection forms and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Inspection content will be displayed here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>View team statistics and leaderboards</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Team performance content will be displayed here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure alerts and notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Notification settings will be displayed here...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
