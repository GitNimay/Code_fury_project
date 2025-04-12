// ManageCandidates.tsx
import React, { useState } from "react";
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
  BarChart3,
  Mail,
  Users,
  Settings,
  Plus,
  Edit, //edit icon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Mock data - Replace with API calls
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

const ManageCandidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState(mockCandidates);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Candidates</h1>
         <Button variant="ghost" className="flex items-center" onClick={() => navigate("/HR/HRProfile")}>
            {/*  <ArrowLeft className="h-4 w-4 mr-2" /> Return */}
            </Button>
      </header>
          {/*Candidate List  */}
        
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                {candidates.map((candidate) => (
                    <Card key={candidate.id} className="bg-white shadow-md p-4 flex flex-col justify-between">
                        <div>
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">{candidate.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">{candidate.position}</p>
                                <p className="text-xs text-gray-500">Experience: {candidate.experience}</p>
                            </CardContent>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/hr/review?candidateId=${candidate.id}`)}>
                                Review
                            </Button>
                            <Edit className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
                        </div>
                    </Card>
                ))}
                </div>
                </div>
  );
};

export default ManageCandidates;