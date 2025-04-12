import React, { useEffect, useState, useCallback } from 'react';
import FaceTracker, { TrackingData } from './FaceTracker';
import PoseDetector from './PoseDetector';
import TrackingStatus from './TrackingStatus';
import TrackingAnalyzer, { AnalysisResult, TrackingReport } from './TrackingAnalyzer';

interface InterviewMonitorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  active?: boolean;
  onAnalysisUpdate?: (analysis: AnalysisResult) => void;
  onReportGenerated?: (report: TrackingReport) => void;
  showStatus?: boolean;
}

const InterviewMonitor: React.FC<InterviewMonitorProps> = ({
  videoRef,
  active = true,
  onAnalysisUpdate,
  onReportGenerated,
  showStatus = true
}) => {
  const [faceData, setFaceData] = useState<TrackingData | null>(null);
  const [poseData, setPoseData] = useState<any | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzer] = useState(() => new TrackingAnalyzer());
  const [videoReady, setVideoReady] = useState(false);
  
  // Check if video is ready
  useEffect(() => {
    const checkVideoReady = () => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        setVideoReady(true);
      } else {
        setTimeout(checkVideoReady, 100);
      }
    };
    
    checkVideoReady();
    
    return () => {
      console.log("Cleaning up InterviewMonitor");
    };
  }, [videoRef]);
  
  // Start tracking when component mounts
  useEffect(() => {
    if (active) {
      console.log("Starting tracking session");
      analyzer.startTracking();
    }
    
    // Generate report when component unmounts
    return () => {
      if (onReportGenerated) {
        console.log("Generating tracking report");
        const report = analyzer.generateReport();
        onReportGenerated(report);
      }
    };
  }, [active, analyzer, onReportGenerated]);
  
  // Process tracking data whenever it changes
  const processTrackingData = useCallback(() => {
    if (!active || (!faceData && !poseData)) return;
    
    // Analyze tracking data
    const analysis = analyzer.analyze(faceData, poseData);
    
    // Log periodic updates to verify data is flowing
    if (Math.random() < 0.05) { // Log ~5% of updates to avoid console spam
      console.log('Tracking update:', { 
        attention: analysis.attention.toFixed(2),
        emotion: analysis.emotionState, 
        posture: analysis.posture
      });
    }
    
    // Update state
    setCurrentAnalysis(analysis);
    
    // Send to parent component
    if (onAnalysisUpdate) {
      onAnalysisUpdate(analysis);
    }
  }, [faceData, poseData, analyzer, onAnalysisUpdate, active]);
  
  // Ensure updates happen on every frame
  useEffect(() => {
    processTrackingData();
  }, [faceData, poseData, processTrackingData]);
  
  // Handle face tracking data
  const handleFaceData = (data: TrackingData) => {
    if (!active) return;
    setFaceData(data);
  };
  
  // Handle pose data
  const handlePoseData = (data: any) => {
    if (!active) return;
    setPoseData(data);
  };
  
  if (!videoReady && videoRef.current) {
    console.log("Video element state:", videoRef.current.readyState);
  }
  
  return (
    <div className="interview-monitor">
      {/* Face tracker (invisible unless debugging) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1 }}>
        {videoReady && (
          <FaceTracker
            videoRef={videoRef}
            onTrackingData={handleFaceData}
            active={active}
          />
        )}
      </div>
      
      {/* Pose detector (partially visible for feedback) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {videoReady && (
          <PoseDetector
            videoRef={videoRef}
            onPoseData={handlePoseData}
            active={active}
            showSkeleton={true}
            showGrid={false}
          />
        )}
      </div>
      
      {/* Tracking status display (optional) */}
      {showStatus && currentAnalysis && (
        <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
          <TrackingStatus analysis={currentAnalysis} expanded={false} />
        </div>
      )}
    </div>
  );
};

export default InterviewMonitor;
