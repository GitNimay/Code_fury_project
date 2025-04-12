import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const SystemCheck = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null); // Explicit type for videoRef
  const audioRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState("Not Checked");
  const [micStatus, setMicStatus] = useState("Not Checked");
  const [loading, setLoading] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null); // Stores the stream
  const [error, setError] = useState<string | null>(null);

  // Function to stop the camera and microphone
  const stopCameraAndMic = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null); // Clear the stream
    }
  };

  const runSystemCheck = async () => {
    setLoading(true);
    setError(null); // Clear any existing errors

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      //set state for use
      setStream(newStream);

      // Set Camera Preview
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        setCameraStatus("Working");
      }

      // Audio Processing
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(newStream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioVisualizer = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
        setAudioLevel(volume);
        requestAnimationFrame(updateAudioVisualizer);
      };

      updateAudioVisualizer();
      setMicStatus("Working");

      // Stop Tracks when Component Unmounts -- moved to separate function

    } catch (e: any) {
      setError(`Error: ${e.message}`); // Set an error message
      setCameraStatus("Not Working");
      setMicStatus("Not Working");
    } finally {
      setLoading(false);
    }
  };

  // Run system check on component mount
  useEffect(() => {
    runSystemCheck();

    // Cleanup function to stop the camera when the component unmounts
    return () => {
      stopCameraAndMic();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const getStatusIcon = (status: string) => {
    if (status === "Working") return <CheckCircle className="text-green-500" size={20} />;
    if (status === "Not Working") return <XCircle className="text-red-500" size={20} />;
    return <Loader2 className="text-gray-500 animate-spin" size={20} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-start">
      <header className="mb-8 flex items-center justify-between w-full max-w-4xl">
        <h1 className="text-3xl font-bold">System Check</h1>
        <Button variant="ghost" onClick={() => {
            stopCameraAndMic(); // Stop the camera before navigating back
            navigate(-1);
          }}>Back</Button>
      </header>

      {/* Full Screen Camera Preview */}
      <div className="relative w-full max-w-4xl h-[60vh] mb-8"> {/* Adjusted height */}
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full bg-black rounded-lg shadow-md object-cover" // Ensure video covers the area
        />
        {/* Status Overlay */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black/50 text-white rounded-lg">
          {loading && <Loader2 className="animate-spin h-10 w-10 mb-4" />}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && (
            <>
              <div className="flex items-center justify-center gap-4">
                Camera: {getStatusIcon(cameraStatus)}
              </div>
              <div className="flex items-center justify-center gap-4">
                Microphone: {getStatusIcon(micStatus)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Audio Visualizer */}
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
            <span className="text-lg">Microphone Level:</span>
            <span className="text-lg">{Math.round(audioLevel)}</span>
          </div>
        <div className="h-3 w-full bg-gray-300 rounded-lg overflow-hidden mt-2">
          <div
            className="h-full bg-blue-500 transition-all duration-200"
            style={{ width: `${audioLevel}%` }}
          ></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-4xl mt-8 flex justify-center">
          <Button onClick={runSystemCheck} className="" disabled={loading}>
            {loading ? "Rechecking..." : "Re-Run System Check"}
          </Button>
        </div>
    </div>
  );
};

export default SystemCheck;