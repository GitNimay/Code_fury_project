// client/src/pages/Candidate/CandidateDashboard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Building2,
  ArrowRight,
  User,
  Settings,
  BookOpen,
  Search,
  Bell, //Notification Icon
  Moon,  // Dark Mode Icon
  Sun,  // Light Mode Icon
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Import your JobInterviewForm modal
import JobInterviewForm from "@/pages/Candidate/JobInterviewForm";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false); // Dark Mode State

  // Mock data for upcoming interviews
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

  const handleJoinInterview = () => {
    toast.success(
      "Interview starting. Please ensure your camera and microphone are working properly."
    );
    setIsFormOpen(true);
  };

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };


  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-primary/5 to-secondary/5"}`}>
      {/* Navigation Bar */}
      <nav className={`border-b ${darkMode ? "bg-gray-800" : "bg-white/50 backdrop-blur-sm"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left side - Branding */}
            <div className="flex items-center gap-4">
              <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-primary"}`}>
                InterviewXpert
              </div>
            </div>

            {/* Middle - Search Bar */}
            <div className="flex-1 mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500" : "focus:ring-primary"}`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Search className={`h-5 w-5 ${darkMode ? "text-gray-300" : "text-gray-400"}`} />
                </div>
              </div>
            </div>

            {/* Right side - Icons and Profile */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" className={darkMode ? "text-white hover:bg-gray-700" : ""} onClick={() => navigate("/candidate/profile")}>
                <User className="h-5 w-5 mr-2" />
                Profile
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={darkMode ? "text-white hover:bg-gray-700" : ""}
                onClick={() => navigate("/candidate/setting")}
              >
                <Bell className="h-5 w-5" />  {/*Replaced List with Bell*/}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={darkMode ? "text-white hover:bg-gray-700" : ""}
                onClick={() => navigate("/candidate/setting")}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={darkMode ? "text-white hover:bg-gray-700" : ""}
                onClick={toggleDarkMode}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : ""}`}>Welcome to your Dashboard!</h1>
          <p className={`text-muted-foreground mt-2 ${darkMode ? "text-gray-400" : ""}`}>
            Your upcoming interviews and preparation details
          </p>
        </motion.div>

        {/* Upcoming Interviews */}
        <section>
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingInterviews.map((interview) => (
              <motion.div
                key={interview.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className={`shadow-lg ${darkMode ? "bg-gray-800 border border-gray-700" : "glass"}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {interview.position}
                      <span className={`text-sm font-normal px-3 py-1 rounded-full ${darkMode ? "bg-blue-900 text-blue-200" : "bg-primary/10 text-primary"}`}>
                        {interview.status}
                      </span>
                    </CardTitle>
                    <CardDescription className={darkMode ? "text-gray-400" : ""}>{interview.company}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-muted-foreground"}`}>
                          <Calendar className="h-4 w-4" />
                          <span>{interview.date}</span>
                        </div>
                        <div className={`flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-muted-foreground"}`}>
                          <Clock className="h-4 w-4" />
                          <span>{interview.time}</span>
                        </div>
                        <div className={`flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-muted-foreground"}`}>
                          <Building2 className="h-4 w-4" />
                          <span>Remote</span>
                        </div>
                      </div>
                      {/* Open the JobInterviewForm modal with toast notification */}
                      <Button className="w-full" onClick={handleJoinInterview}>
                        Join Interview
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : ""}`}>Quick Actions</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card className={`shadow-lg ${darkMode ? "bg-gray-800 border border-gray-700" : "glass"}`}>
              <CardHeader>
                <CardTitle className="text-lg">Practice Interview</CardTitle>
                <CardDescription className={darkMode ? "text-gray-400" : ""}>
                  Try a mock interview to prepare
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/candidate/practice-interview")}
                >
                  Start Practice
                </Button>
              </CardContent>
            </Card>

            <Card className={`shadow-lg ${darkMode ? "bg-gray-800 border border-gray-700" : "glass"}`}>
              <CardHeader>
                <CardTitle className="text-lg">System Check</CardTitle>
                <CardDescription className={darkMode ? "text-gray-400" : ""}>
                  Verify your camera and microphone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/candidate/system-check")}
                >
                  Check Now
                </Button>
              </CardContent>
            </Card>

            <Card className={`shadow-lg ${darkMode ? "bg-gray-800 border border-gray-700" : "glass"}`}>
              <CardHeader>
                <CardTitle className="text-lg">View Past Interviews</CardTitle>
                <CardDescription className={darkMode ? "text-gray-400" : ""}>
                  Review your previous attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/candidate/past-interview")}
                >
                  View History
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Resources & Tips */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : ""}`}>Resources & Tips</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className={`shadow-lg ${darkMode ? "bg-gray-800 border border-gray-700" : "glass"}`}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Interview Tips
                </CardTitle>
                <CardDescription className={darkMode ? "text-gray-400" : ""}>
                  Best practices for remote interviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Test your equipment beforehand</li>
                  <li>Practice common interview questions</li>
                  <li>Dress professionally</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Render the JobInterviewForm modal */}
      <JobInterviewForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};

export default CandidateDashboard;