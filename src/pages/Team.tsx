
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Award, Star, Users, TrendingUp } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";

// Sample data for team members
const teamMembers = [
  {
    id: 1,
    name: "João Silva",
    role: "Site Engineer",
    avatar: "",
    initials: "JS",
    points: 1250,
    badges: ["Quality Champion", "Safety First", "Team Player"],
    stats: {
      inspectionsCompleted: 45,
      complianceRate: 94,
      issuesResolved: 32,
    }
  },
  {
    id: 2,
    name: "Maria Oliveira",
    role: "Quality Inspector",
    avatar: "",
    initials: "MO",
    points: 980,
    badges: ["Detail Master", "Documentation Pro"],
    stats: {
      inspectionsCompleted: 37,
      complianceRate: 91,
      issuesResolved: 28,
    }
  },
  {
    id: 3,
    name: "Carlos Santos",
    role: "Project Manager",
    avatar: "",
    initials: "CS",
    points: 875,
    badges: ["Leadership", "Communication Star"],
    stats: {
      inspectionsCompleted: 22,
      complianceRate: 88,
      issuesResolved: 18,
    }
  },
  {
    id: 4,
    name: "Ana Pereira",
    role: "Quality Inspector",
    avatar: "",
    initials: "AP",
    points: 760,
    badges: ["Rising Star", "Detail Master"],
    stats: {
      inspectionsCompleted: 29,
      complianceRate: 86,
      issuesResolved: 24,
    }
  },
  {
    id: 5,
    name: "Roberto Costa",
    role: "Site Engineer",
    avatar: "",
    initials: "RC",
    points: 640,
    badges: ["Team Player"],
    stats: {
      inspectionsCompleted: 18,
      complianceRate: 83,
      issuesResolved: 15,
    }
  },
];

// Sample data for team achievements
const teamAchievements = [
  { id: 1, title: "100 Inspections Milestone", date: "2023-05-10", points: 500 },
  { id: 2, title: "90% Overall Compliance", date: "2023-04-15", points: 300 },
  { id: 3, title: "Zero Accidents Month", date: "2023-03-31", points: 400 },
  { id: 4, title: "Project Delivery - Ahead of Schedule", date: "2023-02-28", points: 350 },
];

const Team = () => {
  const [activeTab, setActiveTab] = useState<string>("leaderboard");
  
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Engagement</h1>
          <p className="text-gray-600">Track performance, achievements, and rewards for your quality management team</p>
        </div>
        
        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Team Members</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary mr-2" />
                <span className="text-3xl font-bold">12</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Team Points</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-3xl font-bold">4,350</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Compliance</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-3xl font-bold">89%</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="leaderboard">
              <Award className="mr-2 h-4 w-4" /> Leaderboard
            </TabsTrigger>
            <TabsTrigger value="members">
              <Users className="mr-2 h-4 w-4" /> Members
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Star className="mr-2 h-4 w-4" /> Achievements
            </TabsTrigger>
          </TabsList>

          {/* Leaderboard Tab Content */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Points Leaderboard</CardTitle>
                <CardDescription>Top performers ranked by quality management points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {teamMembers
                    .sort((a, b) => b.points - a.points)
                    .map((member, index) => (
                      <div key={member.id} className="flex items-center">
                        <div className="flex items-center justify-center w-8 mr-4">
                          <span className="font-bold text-gray-500">{index + 1}</span>
                        </div>
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <h3 className="font-medium">{member.name}</h3>
                              <span className="text-xs text-gray-500 ml-2">({member.role})</span>
                            </div>
                            <div className="font-semibold text-primary">
                              {member.points} pts
                            </div>
                          </div>
                          <Progress value={member.points / 15} className="h-2" />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Badge Showcase</CardTitle>
                <CardDescription>Special recognitions awarded to team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="flex justify-center mb-2">
                      <Award className="h-8 w-8 text-amber-500" />
                    </div>
                    <h3 className="font-semibold">Quality Champion</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Awarded for maintaining 95%+ compliance
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="flex justify-center mb-2">
                      <Award className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="font-semibold">Safety First</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Zero safety incidents for 3+ months
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="flex justify-center mb-2">
                      <Award className="h-8 w-8 text-purple-500" />
                    </div>
                    <h3 className="font-semibold">Team Player</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Recognized for collaboration excellence
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="flex justify-center mb-2">
                      <Award className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="font-semibold">Detail Master</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Thorough documentation and quality checks
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="flex justify-center mb-2">
                      <Award className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="font-semibold">Rising Star</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Most improved team member
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-500 mr-1" />
                        <span className="font-medium">{member.points}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Badges</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.badges.map((badge, index) => (
                          <Badge key={index} variant="secondary">{badge}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Statistics</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-2 bg-gray-50 rounded-md">
                          <p className="text-lg font-semibold">{member.stats.inspectionsCompleted}</p>
                          <p className="text-xs text-gray-500">Inspections</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-md">
                          <p className="text-lg font-semibold">{member.stats.complianceRate}%</p>
                          <p className="text-xs text-gray-500">Compliance</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-md">
                          <p className="text-lg font-semibold">{member.stats.issuesResolved}</p>
                          <p className="text-xs text-gray-500">Issues Resolved</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Achievements</CardTitle>
                <CardDescription>Recent accomplishments and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {teamAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-start border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="bg-primary/10 p-3 rounded-full mr-4">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <Badge variant="outline">+{achievement.points} pts</Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Achieved on {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
                <CardDescription>Rewards that can be redeemed with team points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 p-4 text-center">
                      <Award className="h-8 w-8 mx-auto text-primary mb-2" />
                      <h3 className="font-semibold">Team Lunch</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-4">
                        Treat your team to lunch at a restaurant of choice
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-primary">1000 points</span>
                        <Button size="sm">Redeem</Button>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 p-4 text-center">
                      <Award className="h-8 w-8 mx-auto text-primary mb-2" />
                      <h3 className="font-semibold">Professional Development</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-4">
                        Training course or workshop of your choice
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-primary">2000 points</span>
                        <Button size="sm">Redeem</Button>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 p-4 text-center">
                      <Award className="h-8 w-8 mx-auto text-primary mb-2" />
                      <h3 className="font-semibold">Extra Day Off</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-4">
                        Enjoy an extra paid day off work
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-primary">3000 points</span>
                        <Button size="sm">Redeem</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Team;
