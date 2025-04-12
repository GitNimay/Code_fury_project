import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, AlertCircle, Video, VideoOff } from "lucide-react";
import { motion } from "framer-motion";
import InterviewMonitor from "@/components/tracking/InterviewMonitor";
import { AnalysisResult, TrackingReport } from "@/components/tracking/TrackingAnalyzer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const LiveInterview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const questionsFromState = location.state?.questions || [];
  const [questions] = useState(questionsFromState);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [trackingActive, setTrackingActive] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);
  const reportRef = useRef<TrackingReport | null>(null);
  const [showCamera, setShowCamera] = useState(true);

  // Timer for questions
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize camera and tracking
  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraAccess(true);
        // Start tracking after a brief delay to ensure video is playing
        setTimeout(() => setTrackingActive(true), 2000);
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraAccess(false);
      }
    };
    getCameraStream();
    
    return () => {
      // Store the final report in session storage when navigating away
      if (reportRef.current) {
        try {
          sessionStorage.setItem('interviewReport', JSON.stringify(reportRef.current));
        } catch (e) {
          console.error('Failed to store report:', e);
        }
      }
    };
  }, []);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeRemaining(120);
    } else {
      // Generate final report and navigate to complete page
      navigate("/interview/complete");
    }
  };

  const handleAnalysisUpdate = (analysis: AnalysisResult) => {
    setCurrentAnalysis(analysis);
    setSuspiciousActivity(analysis.suspiciousActivity);
  };

  const handleReportGenerated = (report: TrackingReport) => {
    reportRef.current = report;
  };

  const progressValue = (timeRemaining / 120) * 100;
  
  // Calculate progress color based on remaining time
  const getProgressColor = () => {
    if (timeRemaining > 60) return "bg-emerald-500";
    if (timeRemaining > 30) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4 md:p-8 flex items-center">
      <motion.div
        className="max-w-7xl mx-auto w-full mt-10 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with interview status */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Live Interview</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-muted-foreground">{isRecording ? 'Recording' : 'Not Recording'}</span>
            </div>
            <div className="h-4 border-r border-gray-300 mx-1"></div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${trackingActive ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-muted-foreground">{trackingActive ? 'Tracking Active' : 'Tracking Inactive'}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Question Panel */}
          <motion.div 
            className="space-y-6" 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-muted">
              <h2 className="text-2xl font-bold mb-4">Question {currentQuestionIndex + 1}/{questions.length}</h2>
              <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg mb-6 border border-primary/10">
                {questions.length > 0 ? (
                  <p className="text-lg">{questions[currentQuestionIndex]}</p>
                ) : (
                  <p className="text-lg">No questions available.</p>
                )}
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Time Remaining</span>
                  <span className={timeRemaining < 30 ? "text-red-500 font-medium" : ""}>
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="h-2 w-full bg-secondary/40 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`} 
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
              </div>
              
              {/* AI Analysis Status */}
              {currentAnalysis && (
                <div className={`p-4 mb-4 rounded-lg ${suspiciousActivity ? "bg-red-500/10 border border-red-500/30" : "bg-emerald-500/10 border border-emerald-500/30"} flex items-center`}>
                  {suspiciousActivity ? (
                    <AlertCircle className="text-red-500 mr-3 flex-shrink-0" size={20} />
                  ) : null}
                  <div>
                    <p className="text-sm font-medium">
                      {suspiciousActivity 
                        ? "Warning: Suspicious activity detected" 
                        : `Attention Score: ${Math.round(currentAnalysis.attention * 100)}%`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentAnalysis.emotionState === "unknown" 
                        ? "Analyzing emotions..." 
                        : `Current emotion: ${currentAnalysis.emotionState}, Posture: ${currentAnalysis.posture}`}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={() => navigate("/interview/start")}>
                        Exit Interview
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Exit without completing the interview</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleNextQuestion}
                        className={currentQuestionIndex < questions.length - 1 ? "bg-primary" : "bg-emerald-600 hover:bg-emerald-700"}
                      >
                        {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Complete Interview"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{currentQuestionIndex < questions.length - 1 
                        ? "Move to the next question" 
                        : "Complete the interview and view results"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Card>
          </motion.div>

          {/* Video Panel */}
          <motion.div 
            className="space-y-4" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <Card className="aspect-video bg-black/60 shadow-lg flex items-center justify-center relative overflow-hidden">
              {hasCameraAccess ? (
                <>
                  {showCamera ? (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/70">
                      <VideoOff size={48} className="mb-2 opacity-50" />
                      <p>Camera is hidden but still tracking</p>
                      <p className="text-xs opacity-70 mt-1">Your posture is still being analyzed</p>
                    </div>
                  )}
                  
                  {/* Camera controls overlay */}
                  <div className="absolute top-3 right-3 z-10">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowCamera(!showCamera)}
                      className="bg-black/30 text-white hover:bg-black/50 rounded-full w-8 h-8"
                    >
                      {showCamera ? <VideoOff size={16} /> : <Video size={16} />}
                    </Button>
                  </div>
                  
                  {/* AI Tracking Overlay */}
                  <div className="absolute inset-0">
                    {trackingActive && (
                      <InterviewMonitor 
                        videoRef={videoRef}
                        active={trackingActive}
                        onAnalysisUpdate={handleAnalysisUpdate}
                        onReportGenerated={handleReportGenerated}
                        showStatus={false}
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className="text-white flex flex-col items-center">
                  <AlertCircle className="mb-2" size={32} />
                  <p className="font-medium">Camera Access Denied</p>
                  <p className="text-sm opacity-70 mt-1">Please enable camera access in your browser settings</p>
                </div>
              )}
            </Card>

            {/* Audio recording controls */}
            <div className="flex justify-center gap-4">
              <Button 
                variant={isRecording ? "destructive" : "default"}
                className={isRecording 
                  ? "bg-red-600 hover:bg-red-700 text-white px-6" 
                  : "bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                }
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            </div>

            {/* Analysis status card */}
            {currentAnalysis && (
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg border border-muted p-2">
                <h3 className="text-sm font-medium mb-2 px-2">Posture & Emotion Analysis</h3>
                <div className="space-y-2">
                  {/* Show current metrics in a cleaner UI */}
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div className="bg-black/5 dark:bg-white/5 p-2 rounded">
                      <p className="text-xs text-muted-foreground mb-1">Attention</p>
                      <p className={`text-sm font-medium ${currentAnalysis.attention > 0.7 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {Math.round(currentAnalysis.attention * 100)}%
                      </p>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 p-2 rounded">
                      <p className="text-xs text-muted-foreground mb-1">Emotion</p>
                      <p className="text-sm font-medium capitalize">{currentAnalysis.emotionState}</p>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 p-2 rounded">
                      <p className="text-xs text-muted-foreground mb-1">Posture</p>
                      <p className={`text-sm font-medium ${currentAnalysis.posture === 'good' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {currentAnalysis.posture.charAt(0).toUpperCase() + currentAnalysis.posture.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveInterview;
