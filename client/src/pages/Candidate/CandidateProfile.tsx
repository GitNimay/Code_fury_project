// pages/Candidate/CandidateProfile.tsx

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CandidateProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "555-123-4567",
  });

  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof profile
  ) => {
    setProfile({ ...profile, [field]: e.target.value });
  };

  const handleSave = () => {
    // Save logic (API call, etc.)
    console.log("Profile saved:", profile);

    // Show success toast
    toast({
      title: "Profile Updated",
      description: "Your profile changes have been saved successfully.",
    });

    // Navigate back to the candidate dashboard
    navigate("/candidate/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <motion.div
        className="max-w-xl mx-auto mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/candidate/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card className="glass p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                type="text"
                value={profile.name}
                onChange={(e) => handleChange(e, "name")}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange(e, "email")}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange(e, "phone")}
                className="w-full"
              />
            </div>
            <div className="mt-6">
              <Button className="w-full" onClick={handleSave}>
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CandidateProfile;
