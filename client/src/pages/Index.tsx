
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Building2, ArrowRight, User, List, Settings } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  const upcomingInterviews = [
    {
      id: 1,
      position: "Frontend Developer",
      company: "TechCorp Inc.", 
      date: "2024-03-25",
      time: "10:00 AM",
      status: "Scheduled",
    },
    {
      id: 2,
      position: "Senior React Developer",
      company: "Innovation Labs",
      date: "2024-03-26",
      time: "2:30 PM",
      status: "Scheduled",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Navigation Bar */}
      <nav className="border-b bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-2xl font-bold text-primary">InterviewXpert</div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <List className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Welcome to your Dashboard!</h1>
          <p className="text-muted-foreground mt-2">Your upcoming interviews and preparation details</p>
        </motion.div>

        {/* Interview Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingInterviews.map((interview) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {interview.position}
                    <span className="text-sm font-normal px-3 py-1 bg-primary/10 text-primary rounded-full">
                      {interview.status}
                    </span>
                  </CardTitle>
                  <CardDescription>{interview.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{interview.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{interview.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>Remote</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => navigate("/interview/start")}
                    >
                      Join Interview
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Practice Interview</CardTitle>
              <CardDescription>Try a mock interview to prepare</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Start Practice</Button>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">System Check</CardTitle>
              <CardDescription>Verify your camera and microphone</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Check Now</Button>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">View Past Interviews</CardTitle>
              <CardDescription>Review your previous attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">View History</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
