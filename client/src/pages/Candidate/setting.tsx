import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Setting = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [profilePublic, setProfilePublic] = useState(true);
  const [language, setLanguage] = useState("en");

  const handleSave = () => {
    // Add your save logic here.
    console.log("Settings saved!", {
      username,
      email,
      notifications,
      darkMode,
      profilePublic,
      language,
    });
    // Navigate back to the Candidate Dashboard
    navigate("/candidate/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Back
        </Button>
      </header>

      {/* Settings Content */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Profile Settings */}
        <Card className="shadow-lg bg-white rounded-md">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <CardTitle className="text-2xl font-semibold">Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-4">
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="shadow-lg bg-white rounded-md">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <CardTitle className="text-2xl font-semibold">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-4">
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Change Password</label>
              <input
                type="password"
                placeholder="New Password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm New Password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-lg bg-white rounded-md">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <CardTitle className="text-2xl font-semibold">Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-700">Enable Notifications</span>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                  notifications ? "justify-end bg-blue-500" : "justify-start bg-gray-300"
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="shadow-lg bg-white rounded-md">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <CardTitle className="text-2xl font-semibold">Theme Settings</CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-700">Dark Mode</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                  darkMode ? "justify-end bg-blue-500" : "justify-start bg-gray-300"
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="shadow-lg bg-white rounded-md">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <CardTitle className="text-2xl font-semibold">Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-700">Make Profile Public</span>
              <button
                onClick={() => setProfilePublic(!profilePublic)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                  profilePublic ? "justify-end bg-blue-500" : "justify-start bg-gray-300"
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="shadow-lg bg-white rounded-md">
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <CardTitle className="text-2xl font-semibold">Language Settings</CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-4">
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Save Changes */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-8 py-3 text-lg">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
