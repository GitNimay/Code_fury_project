import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const InterviewLandingPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [userType, setUserType] = useState<"candidate" | "hr" | null>(null);

  // Background style depends on mode
  const backgroundStyle = darkMode
    ? {
        background: "rgba(0,10,20,1)",
        backgroundSize: "cover",
      }
    : {
        background: "#ffffff",
      };

  // Text color class for content
  const textColorClass = darkMode ? "text-white" : "text-gray-800";

  useEffect(() => {
    // Only run the starfield effect in dark mode
    if (!darkMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext("2d");
    if (!c) return;

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let numStars = 1900;
    let focalLength = canvas.width * 2;
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let stars: any[] = [];
    let star: any;
    let i: number;
    let animate = true;

    function initializeStars() {
      centerX = canvas.width / 2;
      centerY = canvas.height / 2;
      stars = [];
      for (i = 0; i < numStars; i++) {
        star = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * canvas.width,
          o: "0." + (Math.floor(Math.random() * 99) + 1),
        };
        stars.push(star);
      }
    }

    function moveStars() {
      for (i = 0; i < numStars; i++) {
        star = stars[i];
        star.z--;
        if (star.z <= 0) {
          star.z = canvas.width;
        }
      }
    }

    function drawStars() {
      // Resize canvas if the window size changes
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializeStars();
      }
      c.fillStyle = "rgba(0,10,20,1)";
      c.fillRect(0, 0, canvas.width, canvas.height);
      for (i = 0; i < numStars; i++) {
        star = stars[i];
        const pixelX = (star.x - centerX) * (focalLength / star.z) + centerX;
        const pixelY = (star.y - centerY) * (focalLength / star.z) + centerY;
        const pixelRadius = 1 * (focalLength / star.z);
        c.fillStyle = "rgba(209, 255, 255, " + star.o + ")";
        c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
      }
    }

    function executeFrame() {
      if (animate) requestAnimationFrame(executeFrame);
      moveStars();
      drawStars();
    }

    initializeStars();
    executeFrame();

    // Cleanup on unmount
    return () => {
      animate = false;
    };
  }, [darkMode]);

  return (
    <div className="relative min-h-screen overflow-auto" style={backgroundStyle}>
      {/* Starfield Canvas (Dark Mode Only) */}
      {darkMode && (
        <canvas
          id="space"
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      )}

      {/* Dark Mode Toggle Button */}
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className="absolute z-20 top-4 right-4 px-4 py-2 bg-black/50 text-white rounded-md shadow-md hover:bg-black/70 transition-colors"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className={`text-4xl md:text-6xl font-bold ${textColorClass}`}>
              InterviewXpert 
            </h1>
            <p className={`text-lg md:text-xl max-w-3xl mx-auto ${textColorClass}`}>
              Revolutionary AI-powered interview platform for candidates and recruiters
            </p>
            
            {/* User Type Selection */}
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
              <Button
                onClick={() => setUserType("candidate")}
                variant={userType === "candidate" ? "default" : "outline"}
                className={`px-8 py-6 text-lg rounded-full ${userType === "candidate" ? "bg-blue-600" : ""}`}
              >
                I'm a Candidate
              </Button>
              <Button
                onClick={() => setUserType("hr")}
                variant={userType === "hr" ? "default" : "outline"}
                className={`px-8 py-6 text-lg rounded-full ${userType === "hr" ? "bg-indigo-600" : ""}`}
              >
                I'm a Recruiter
              </Button>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <Button
                onClick={() => navigate("/register")}
                variant="default"
                className="px-8 py-6 text-lg rounded-full"
              >
                Get Started
              </Button>
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="px-8 py-6 text-lg rounded-full"
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Key Features Section */}
        <section className="py-20 px-4" id="features">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto text-center space-y-12"
          >
            <h2 className={`text-3xl font-bold ${textColorClass}`}>Advanced AI Interview Technology</h2>
            <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Our platform harnesses the power of artificial intelligence to transform the interview process
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Feature 1: Emotion Detection */}
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-black/50 p-8 rounded-2xl shadow-lg"
              >
                <div className="text-5xl mb-4 text-blue-400 flex justify-center">
                  😊
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Emotion Detection</h3>
                <p className="text-gray-300">
                  Our AI analyzes facial expressions and voice patterns to measure stress levels and confidence during interviews. Get real-time insights into emotional responses.
                </p>
                {userType === "hr" && (
                  <p className="mt-4 text-blue-300 text-sm font-medium">
                    Gain deeper insights into candidate comfort and confidence levels
                  </p>
                )}
                {userType === "candidate" && (
                  <p className="mt-4 text-blue-300 text-sm font-medium">
                    Practice interviews with emotional feedback to improve your performance
                  </p>
                )}
              </motion.div>

              {/* Feature 2: Resume-Based Questions */}
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-black/50 p-8 rounded-2xl shadow-lg"
              >
                <div className="text-5xl mb-4 text-green-400 flex justify-center">
                  📝
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Personalized Questions</h3>
                <p className="text-gray-300">
                  Upload your resume, and our AI generates tailored questions based on your experience and skills. Every interview is customized to the candidate's background.
                </p>
                {userType === "hr" && (
                  <p className="mt-4 text-green-300 text-sm font-medium">
                    Save time with automatic question generation based on candidate profiles
                  </p>
                )}
                {userType === "candidate" && (
                  <p className="mt-4 text-green-300 text-sm font-medium">
                    Face questions relevant to your actual experience, not generic interviews
                  </p>
                )}
              </motion.div>

              {/* Feature 3: AI Interviewer */}
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-black/50 p-8 rounded-2xl shadow-lg"
              >
                <div className="text-5xl mb-4 text-purple-400 flex justify-center">
                  🤖
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">AI-Conducted Interviews</h3>
                <p className="text-gray-300">
                Your sophisticated AI conducts natural, conversational interviews, adapting to responses. Our AI is available 24/7, making conversations with candidates, asking questions, and adjusting difficulty levels accordingly.
                </p>
                {userType === "hr" && (
                  <p className="mt-4 text-purple-300 text-sm font-medium">
                    Screen more candidates efficiently without scheduling constraints
                  </p>
                )}
                {userType === "candidate" && (
                  <p className="mt-4 text-purple-300 text-sm font-medium">
                    Interview on your schedule, practice as many times as you need
                  </p>
                )}
              </motion.div>

              {/* Feature 4: Performance Reports */}
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-black/50 p-8 rounded-2xl shadow-lg"
              >
                <div className="text-5xl mb-4 text-orange-400 flex justify-center">
                  📊
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Comprehensive Reports</h3>
                <p className="text-gray-300">
                  Generate detailed performance reports with scores, key moments, and insights. Review recorded interviews with highlighted critical responses.
                </p>
                {userType === "hr" && (
                  <p className="mt-4 text-orange-300 text-sm font-medium">
                    Compare candidates objectively with standardized metrics and highlight reels
                  </p>
                )}
                {userType === "candidate" && (
                  <p className="mt-4 text-orange-300 text-sm font-medium">
                    Receive actionable feedback to improve your interview performance
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-transparent to-black/30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto text-center space-y-12"
          >
            <h2 className="text-3xl font-bold text-white">How It Works</h2>
            
            {userType === "candidate" && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-black/40 p-6 rounded-xl shadow-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Upload Resume</h3>
                  <p className="text-gray-300">
                    Create your profile and upload your resume to our secure platform
                  </p>
                </div>
                <div className="bg-black/40 p-6 rounded-xl shadow-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Complete AI Interview</h3>
                  <p className="text-gray-300">
                    Participate in an AI-conducted interview based on your experience
                  </p>
                </div>
                <div className="bg-black/40 p-6 rounded-xl shadow-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Receive Feedback</h3>
                  <p className="text-gray-300">
                    Get instant analysis and areas for improvement
                  </p>
                </div>
              </div>
            )}
            
            {userType === "hr" && (
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-black/40 p-6 rounded-xl shadow-lg">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Set Job Requirements</h3>
                  <p className="text-gray-300">
                    Define position requirements and ideal candidate profile
                  </p>
                </div>
                <div className="bg-black/40 p-6 rounded-xl shadow-lg">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Invite Candidates</h3>
                  <p className="text-gray-300">
                    Send automated interview invitations to applicants
                  </p>
                </div>
                <div className="bg-black/40 p-6 rounded-xl shadow-lg">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">AI Conducts Interviews</h3>
                  <p className="text-gray-300">
                    Let our AI handle the initial screening process
                  </p>
                </div>
                <div className="bg-black/40 p-6 rounded-xl shadow-lg">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Review Reports</h3>
                  <p className="text-gray-300">
                    Analyze comprehensive candidate performance data
                  </p>
                </div>
              </div>
            )}
            
            {!userType && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/40 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold mb-2 text-white">For Candidates</h3>
                  <p className="text-gray-300 mb-4">
                    Practice interviews, get feedback, and improve your performance before real interviews
                  </p>
                  <Button
                    onClick={() => setUserType("candidate")}
                    variant="outline"
                    className="mt-2"
                  >
                    Learn More
                  </Button>
                </div>
                <div className="bg-black/40 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold mb-2 text-white">For Recruiters</h3>
                  <p className="text-gray-300 mb-4">
                    Screen candidates efficiently with AI-powered interviews and data-driven insights
                  </p>
                  <Button
                    onClick={() => setUserType("hr")}
                    variant="outline"
                    className="mt-2"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20 px-4 bg-gray-800">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <h2 className="text-3xl font-bold text-white">Success Stories</h2>
            <div className="space-y-8">
              {userType === "candidate" && (
                <>
                  <div className="bg-black/50 p-6 rounded-lg shadow-lg">
                    <p className="text-lg italic text-white">
                      "InterviewXpert AI helped me prepare for my tech interviews with realistic questions based on my actual experience. The emotional feedback showed me how to appear more confident."
                    </p>
                    <p className="mt-4 font-semibold text-white">- Software Engineer, Successfully hired at TechCorp</p>
                  </div>
                  <div className="bg-black/50 p-6 rounded-lg shadow-lg">
                    <p className="text-lg italic text-white">
                      "After practicing with InterviewXpert, I knew exactly what to expect and how to respond. The personalized questions matched almost exactly what I was asked in the real interview!"
                    </p>
                    <p className="mt-4 font-semibold text-white">- Marketing Manager, Innovation Media</p>
                  </div>
                </>
              )}
              
              {userType === "hr" && (
                <>
                  <div className="bg-black/50 p-6 rounded-lg shadow-lg">
                    <p className="text-lg italic text-white">
                      "We've reduced our time-to-hire by 40% while improving quality of hires. The AI interviews highlight candidate strengths we might have missed in traditional screening."
                    </p>
                    <p className="mt-4 font-semibold text-white">- HR Director, Enterprise Solutions Inc.</p>
                  </div>
                  <div className="bg-black/50 p-6 rounded-lg shadow-lg">
                    <p className="text-lg italic text-white">
                      "The emotion detection has been invaluable in finding candidates who not only have the skills but also thrive under pressure. The key moments feature saves hours of interview review time."
                    </p>
                    <p className="mt-4 font-semibold text-white">- Talent Acquisition Manager, Future Finance</p>
                  </div>
                </>
              )}
              
              {!userType && (
                <>
                  <div className="bg-black/50 p-6 rounded-lg shadow-lg">
                    <p className="text-lg italic text-white">
                      "InterviewXpert has revolutionized our hiring process. The platform is intuitive and the insights are invaluable for both our team and candidates."
                    </p>
                    <p className="mt-4 font-semibold text-white">- HR Manager, TechCorp Inc.</p>
                  </div>
                  <div className="bg-black/50 p-6 rounded-lg shadow-lg">
                    <p className="text-lg italic text-white">
                      "As a job seeker, the practice interviews and feedback helped me land my dream job. I was much more prepared and confident."
                    </p>
                    <p className="mt-4 font-semibold text-white">- Senior Developer, Innovation Labs</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <h2 className={`text-3xl font-bold ${textColorClass}`}>Ready to Transform Your Interview Experience?</h2>
            <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Join thousands of professionals using InterviewXpert AI for smarter interviews.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
              <Button
                onClick={() => navigate("/register")}
                variant="default"
                className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                Start Free Trial
              </Button>
              <Button
                onClick={() => navigate("/demo")}
                variant="outline"
                className="px-8 py-6 text-lg rounded-full"
              >
                Request Demo
              </Button>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${textColorClass}`}>InterviewXpert AI</h3>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Revolutionizing the interview process with AI technology.
              </p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${textColorClass}`}>Platform</h3>
              <ul className={`space-y-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                <li>For Candidates</li>
                <li>For Recruiters</li>
                <li>Enterprise Solutions</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${textColorClass}`}>Resources</h3>
              <ul className={`space-y-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                <li>Blog</li>
                <li>Help Center</li>
                <li>Case Studies</li>
                <li>API Documentation</li>
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${textColorClass}`}>Company</h3>
              <ul className={`space-y-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              &copy; {new Date().getFullYear()} InterviewXpert AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InterviewLandingPage;