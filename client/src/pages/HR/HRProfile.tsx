// HRProfile.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const HRProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    role: "Senior HR Manager",
    email: "alex.johnson@company.com",
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof profile
  ) => {
    setProfile({ ...profile, [field]: e.target.value });
  };

  // Handle save logic (API call, etc.)
  const handleSave = () => {
    console.log("Profile saved:", profile);
    // Optionally navigate back or to another page
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6 flex items-center justify-center">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">HR Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                type="text"
                value={profile.name}
                onChange={(e) => handleChange(e, "name")}
                className="w-full"
              />
            </div>
            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <Input
                type="text"
                value={profile.role}
                onChange={(e) => handleChange(e, "role")}
                className="w-full"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange(e, "email")}
                className="w-full"
              />
            </div>
            {/* Actions */}
            <div className="flex gap-4 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleSave}>
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default HRProfile;
