import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PastInterview = () => {
  const navigate = useNavigate();

  const pastInterviews = [
    {
      id: 1,
      position: "Backend Developer",
      company: "Alpha Tech",
      date: "2024-02-20",
      time: "3:00 PM",
      status: "Completed",
    },
    {
      id: 2,
      position: "Full Stack Developer",
      company: "Beta Innovations",
      date: "2024-01-15",
      time: "11:00 AM",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      {/* Header Section */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-8">
        <h1 className="text-4xl font-semibold text-gray-900">Past Interviews</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </header>

      {/* Interviews List */}
      <div className="w-full max-w-4xl space-y-6">
        {pastInterviews.map((interview) => (
          <Card key={interview.id} className="shadow-md border border-gray-200">
            <CardHeader className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <CardTitle className="text-xl font-medium">{interview.position}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-5 flex flex-col gap-2 text-gray-700">
              <p className="text-lg font-medium">{interview.company}</p>
              <p className="text-sm text-gray-500">{interview.date} at {interview.time}</p>
              <div className="mt-3">
                <Badge className="bg-green-500 text-white px-3 py-1">{interview.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PastInterview;
