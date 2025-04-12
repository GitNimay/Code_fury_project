
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Webcam, Mic } from "lucide-react";

const InterviewStart = () => {
  const [hasWebcamAccess, setHasWebcamAccess] = useState(false);
  const [hasMicAccess, setHasMicAccess] = useState(false);
  const navigate = useNavigate();

  const startInterview = () => {
    if (hasWebcamAccess && hasMicAccess) {
      navigate("/interview/live");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Candidate Info & Instructions */}
          <div className="space-y-6">
            <Card className="p-6 glass">
              <h2 className="text-2xl font-bold mb-4">Let's Get Started</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Job Role</h3>
                  <p className="text-muted-foreground">Frontend Developer</p>
                </div>
                <div>
                  <h3 className="font-semibold">Tech Stack</h3>
                  <p className="text-muted-foreground">React, TypeScript, Node.js</p>
                </div>
                <div>
                  <h3 className="font-semibold">Experience Required</h3>
                  <p className="text-muted-foreground">3+ years</p>
                </div>
              </div>
            </Card>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-700">
                Please ensure your webcam and microphone are working properly. Your video
                will only be used during the interview and is never recorded.
              </p>
            </div>
          </div>

          {/* Right Column - Webcam & Microphone Access */}
          <div className="space-y-6">
            <Card className="p-6 glass">
              <div className="space-y-6">
                <div className="bg-muted rounded-lg p-8 text-center">
                  <Webcam className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <Button 
                    variant={hasWebcamAccess ? "outline" : "default"}
                    onClick={() => setHasWebcamAccess(true)}
                    className="w-full"
                  >
                    {hasWebcamAccess ? "Webcam Connected" : "Enable Webcam"}
                  </Button>
                </div>

                <div className="bg-muted rounded-lg p-8 text-center">
                  <Mic className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <Button 
                    variant={hasMicAccess ? "outline" : "default"}
                    onClick={() => setHasMicAccess(true)}
                    className="w-full"
                  >
                    {hasMicAccess ? "Microphone Connected" : "Enable Microphone"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Start Interview Button */}
        <div className="mt-8 text-center">
          <Button
            size="lg"
            onClick={startInterview}
            disabled={!hasWebcamAccess || !hasMicAccess}
            className="w-full md:w-auto min-w-[200px]"
          >
            Start Interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewStart;
