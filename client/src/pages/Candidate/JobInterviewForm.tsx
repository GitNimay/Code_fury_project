import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const JobInterviewForm = ({ isOpen, onClose }) => {
  const [jobRole, setJobRole] = useState("");
  const [techStack, setTechStack] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!jobRole || !techStack) {
      alert("Please fill in your job role and tech stack.");
      return;
    }

    setLoading(true);

    try {
      // Sample questions based on job role and tech stack
      // In a real implementation, you might want to call a different API endpoint
      // that generates questions based on job role and tech stack instead of resume
      const sampleQuestions = [
        `Tell me about your experience as a ${jobRole}.`,
        `Describe a challenging project you worked on using ${techStack}.`,
        `How do you stay updated with the latest trends in ${techStack}?`,
        `What's your approach to problem-solving in ${jobRole} roles?`,
        `How do you handle tight deadlines when working with ${techStack}?`,
        `Can you walk through your development process when building applications with ${techStack}?`,
        `What aspects of ${jobRole} do you find most interesting?`,
      ];

      // Navigate to the interview page with generated questions
      navigate("/interview/live", { state: { questions: sampleQuestions } });
    } catch (error) {
      console.error("Error preparing interview:", error);
      alert("Error preparing interview. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 rounded-lg shadow-lg w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Prepare for Interview
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Provide details about your job role and experience.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Job Role</label>
            <Input
              placeholder="Ex. Full Stack Developer"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Technologies/Skills</label>
            <Textarea
              placeholder="Ex. React, Node.js, SQL, etc."
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Years of Experience</label>
            <Input
              placeholder="Years of Experience"
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing..." : "Start Interview"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobInterviewForm;
