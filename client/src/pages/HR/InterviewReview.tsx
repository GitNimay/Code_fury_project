// InterviewReview.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Video,
  FileText,
  ThumbsUp,
  AlertTriangle,
  Smile,
  ChevronRight,
  Clock,
  ArrowLeftRight,
  UserCheck,
  UserX,
  BarChart3, // New: Analytics Icon
  Mail,       // New: Contact Icon
  Users,
  Settings,   //New Setting Icon
  Plus,       //New ADD Icon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"; // Import toast hook

// Mock candidate data - REMEMBER TO REPLACE WITH REAL DATA
interface Candidate {
  id: string;
  name: string;
  position: string;
  experience: string;
  date: string;
  duration: string;
  scores: {
    technical: number;
    communication: number;
    problemSolving: number;
    overall: number;
  };
  emotions: {
    confident: number;
    nervous: number;
    neutral: number;
  };
  keyMoments: {
    timestamp: string;
    type: "positive" | "warning";
    note: string;
  }[];
  additionalInsights: {
    technical: string;
    communication: string;
    problemSolving: string;
  };
}

const mockCandidates: Candidate[] = [
  {
    id: "c1",
    name: "John Doe",
    position: "Frontend Developer",
    experience: "5 years",
    date: "2024-03-20",
    duration: "45 minutes",
    scores: {
      technical: 85,
      communication: 78,
      problemSolving: 82,
      overall: 82,
    },
    emotions: {
      confident: 65,
      nervous: 15,
      neutral: 20,
    },
    keyMoments: [
      {
        timestamp: "12:45",
        type: "positive",
        note: "Excellent explanation of React hooks",
      },
      {
        timestamp: "23:15",
        type: "warning",
        note: "Showed uncertainty about system design",
      },
      {
        timestamp: "35:30",
        type: "positive",
        note: "Strong problem-solving approach",
      },
    ],
    additionalInsights: {
      technical: "Good fundamentals; might elaborate on advanced optimizations.",
      communication: "Clear and concise overall, but ensure clarity on complex topics.",
      problemSolving: "Solid approach, though more detail on structured thinking could help.",
    }
  },
  {
    id: "c2",
    name: "Jane Smith",
    position: "Full Stack Developer",
    experience: "3 years",
    date: "2024-04-10",
    duration: "50 minutes",
    scores: {
      technical: 78,
      communication: 85,
      problemSolving: 80,
      overall: 81,
    },
    emotions: {
      confident: 50,
      nervous: 25,
      neutral: 25,
    },
    keyMoments: [
      {
        timestamp: "10:20",
        type: "positive",
        note: "Clear explanation of Node.js architecture",
      },
      {
        timestamp: "20:10",
        type: "warning",
        note: "Unsure about advanced React optimization",
      },
    ],
    additionalInsights: {
      technical: "Shows potential; needs more practical experience.",
      communication: "Excellent listener and presenter.",
      problemSolving: "Creative and resourceful; good analytical skills.",
    }
  },
];

// Flipping card sub-component for Performance Metrics (Front Only Now)
const PerformanceFlipCard = ({
  technical,
  communication,
  problemSolving,
}: {
  technical: number;
  communication: number;
  problemSolving: number;
}) => {
  return (
    <Card className=" p-4 bg-white">  {/*Removed glass and added white background*/}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5 text-primary" />
          <span>Performance Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Technical Skills</span>
            <span className="font-medium">{technical}%</span>
          </div>
          <Progress value={technical} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Communication</span>
            <span className="font-medium">{communication}%</span>
          </div>
          <Progress value={communication} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Problem Solving</span>
            <span className="font-medium">{problemSolving}%</span>
          </div>
          <Progress value={problemSolving} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

const InterviewReview = () => {
  const navigate = useNavigate();
  const [decisionMade, setDecisionMade] = useState<"approve" | "reject" | null>(
    null
  );
  const [selectedCandidateId, setSelectedCandidateId] = useState("c1");
  const { toast } = useToast(); // Get the toast function

  // Find the candidate object from the mockCandidates array
  const candidate = mockCandidates.find((c) => c.id === selectedCandidateId);

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <p>No candidate data found.</p>
      </div>
    );
  }

  const handleConfirmDecision = async () => {
    if (!decisionMade) {
      toast({
        title: "Error",
        description: "Please approve or reject the candidate before confirming.",
        variant: "destructive",
      });
      return;
    }

    // Simulate saving the decision to a database (replace with your actual logic)
    try {
      // Simulate an asynchronous save operation with try catch
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 0.5 second

      // On successful save, clear data and return to main page for hr
      setDecisionMade(null);
      setSelectedCandidateId("c1"); // Reset to the first candidate or a default state
      toast({
        title: "Decision Saved",
        description: `Candidate ${candidate.name} has been ${decisionMade}d.`,
      });
      navigate("/HR/HRProfile"); // Navigate to HR's main dashboard
    } catch (error: any) {
      toast({
        title: "Error Saving",
        description: `There was an error saving your decision. Please try again. Error: ${error.message}`, // Include error message
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">

      {/* Main Content Area - Shifted to the Right */}
      <main className=" p-8">
        {/* horizontal navbar */}
        <nav className="flex items-center justify-between p-4 bg-white shadow-md">
          {/* Top Button Row to Return to previous Page */}
          <Button variant="ghost" className="flex items-center" onClick={() => navigate(-1)}>
            InterviewXpert
          </Button>

          {/* Main Menu Items - HR-Centric */}
          <div className="flex items-center space-x-4">
            {/* <Button variant="ghost" className="flex items-center" onClick={() => navigate("/HR/HRProfile")}>
              <User className="h-4 w-4 mr-2" /> HR Profile
            </Button> */}
            <Button variant="ghost" className="flex items-center" onClick={() => navigate("/candidate/man")}>
            <Users className="h-4 w-4 mr-2" /> Manage Candidates
            </Button>
            <Button variant="ghost" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" /> Analytics
            </Button>
            <Button variant="ghost" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" /> Contact Support
            </Button>
            <Button variant="ghost" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" /> Add New Job
            </Button>
            <Button variant="ghost" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
          </div>
        </nav>

        {/* Candidate Selection */}
        <Card className="mt-4 bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Select Candidate</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedCandidateId}
              onValueChange={(val) => setSelectedCandidateId(val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a candidate" />
              </SelectTrigger>
              <SelectContent>
                {mockCandidates.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} - {c.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Candidate Overview & Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="md:col-span-2  bg-white">
            <CardHeader>
              <CardTitle>Candidate Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {candidate.position} • {candidate.experience} exp
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Duration: {candidate.duration}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Overall Score</div>
                  <div className="text-3xl font-bold text-primary">
                    {candidate.scores.overall}%
                  </div>
                  <Progress value={candidate.scores.overall} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className=" bg-white">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full gap-2" variant="outline">
                <Video className="h-4 w-4" />
                Watch Recording
              </Button>
              <Button className="w-full gap-2" variant="outline">
                <FileText className="h-4 w-4" />
                View Full Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics (Flip Card) & Key Moments */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Performance Metrics Card */}
          <PerformanceFlipCard
            technical={candidate.scores.technical}
            communication={candidate.scores.communication}
            problemSolving={candidate.scores.problemSolving}
          />

          {/* Key Moments Card */}
          <Card className=" bg-white">
            <CardHeader>
              <CardTitle>Key Moments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidate.keyMoments.map((moment, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50"
                  >
                    {moment.type === "positive" ? (
                      <ThumbsUp className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{moment.note}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Timestamp: {moment.timestamp}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            {/*<h2 className={`text-xl font-semibold ${textColorClass}`}>Key Moments</h2>
                                                <p className={`text-lg ${mutedTextColorClass}`}>Our platform harnesses the power of artificial intelligence to transform the interview process</p> */}
          </Card>
        </div>

        {/* Emotional Analysis & Additional Insights - NEW CARD */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Emotional Analysis Card */}
          <Card className=" bg-white">
            <CardHeader>
              <CardTitle>Emotional Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Smile className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Confident</span>
                    </div>
                    <span className="font-bold">
                      {candidate.emotions.confident}%
                    </span>
                  </div>
                  <Progress value={candidate.emotions.confident} className="h-2" />
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Smile className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">Nervous</span>
                    </div>
                    <span className="font-bold">
                      {candidate.emotions.nervous}%
                    </span>
                  </div>
                  <Progress value={candidate.emotions.nervous} className="h-2" />
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Smile className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Neutral</span>
                    </div>
                    <span className="font-bold">
                      {candidate.emotions.neutral}%
                    </span>
                  </div>
                  <Progress value={candidate.emotions.neutral} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Insights Card - NEW CARD */}
          <Card className=" bg-white">
            <CardHeader>
              <CardTitle>Additional Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><strong>Technical:</strong> {candidate.additionalInsights.technical}</p>
              <p><strong>Communication:</strong> {candidate.additionalInsights.communication}</p>
              <p><strong>Problem Solving:</strong> {candidate.additionalInsights.problemSolving}</p>
            </CardContent>
          </Card>
        </div>

        {/* Final Decision */}
        <Card className=" bg-white">
          <CardHeader>
            <CardTitle>Make Your Decision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                className="flex-1 gap-2"
                variant={decisionMade === "approve" ? "default" : "outline"}
                onClick={() => setDecisionMade("approve")}
              >
                <UserCheck className="h-4 w-4" />
                Approve Candidate
              </Button>
              <Button
                className="flex-1 gap-2"
                variant={decisionMade === "reject" ? "destructive" : "outline"}
                onClick={() => setDecisionMade("reject")}
              >
                <UserX className="h-4 w-4" />
                Reject Candidate
              </Button>
            </div>
            {decisionMade && (
              <div className="mt-4">
                <Button className="w-full" onClick={handleConfirmDecision}>Confirm Decision</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InterviewReview;