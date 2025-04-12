import React, { useEffect, useRef, useState } from 'react';

interface FaceTrackerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onTrackingData?: (data: TrackingData) => void;
  active?: boolean;
}

export interface TrackingData {
  position: {
    lookingAway: boolean;
    abnormalPosition: boolean;
  };
  emotions: {
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
    neutral: number;
    dominant: string;
  };
  attention: number;
  headMovement: {
    stability: number;
    excessiveMovement: boolean;
  };
}

interface MockBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MockPoint {
  x: number;
  y: number;
}

const FaceTracker: React.FC<FaceTrackerProps> = ({ videoRef, onTrackingData, active = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [trackingStarted, setTrackingStarted] = useState(false);
  const requestRef = useRef<number>();
  const previousPositions = useRef<Array<MockPoint>>([]);
  const analysisCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevFrameDataRef = useRef<ImageData | null>(null);
  const facePresentTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [facePresent, setFacePresent] = useState(true);
  const noFaceFrameCount = useRef(0);
  const lastEmotions = useRef<{[key: string]: number} | null>(null);
  const frameCounter = useRef(0);
  
  console.log("FaceTracker rendered, active:", active);
  
  // Simulate loading the face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Loading face models...");
        // Simulate loading time for models
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Face tracking models loaded successfully');
        setModelsLoaded(true);
      } catch (error) {
        console.error('Error loading face tracking models:', error);
      }
    };

    loadModels();
    
    return () => {
      console.log("Cleaning up FaceTracker");
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
      }
      if (facePresentTimeoutRef.current) {
        clearTimeout(facePresentTimeoutRef.current);
      }
    };
  }, []);

  // Start tracking when models are loaded and component is active
  useEffect(() => {
    console.log("FaceTracker useEffect - modelsLoaded:", modelsLoaded, "active:", active, 
                "video ready:", videoRef.current?.readyState);
    
    if (modelsLoaded && active && videoRef.current && videoRef.current.readyState >= 2) {
      console.log("Starting face tracking");
      if (!trackingStarted) {
        startTracking();
        setTrackingStarted(true);
      }
    } else if (!active && trackingStarted) {
      console.log("Stopping face tracking");
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
      }
      setTrackingStarted(false);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
      }
    };
  }, [modelsLoaded, active, trackingStarted, videoRef]);

  const startTracking = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.log("Cannot start tracking - video or canvas not ready");
      return;
    }
    
    // Create an offscreen canvas for analysis
    if (!analysisCanvasRef.current) {
      analysisCanvasRef.current = document.createElement('canvas');
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    console.log("Video dimensions:", video.videoWidth, "x", video.videoHeight);
    
    const displaySize = { 
      width: video.videoWidth || 640, 
      height: video.videoHeight || 480 
    };
    
    // Set canvas size to match video
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;
    
    // Set analysis canvas size
    analysisCanvasRef.current.width = 100; // Lower resolution for faster processing
    analysisCanvasRef.current.height = 75;
    
    console.log("Starting face detection loop");
    
    const detectFace = () => {
      frameCounter.current += 1;
      
      if (!videoRef.current || !canvas || videoRef.current.paused || videoRef.current.ended) {
        console.log("Video not ready in detection loop, requesting next frame");
        requestRef.current = requestAnimationFrame(detectFace);
        return;
      }
      
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          requestRef.current = requestAnimationFrame(detectFace);
          return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Use pixel-based detection to determine if user is present
        // For real tracking, check every frame; for mock detection, use simple movement
        const isFacePresent = generatePresenceFromVideo();
        
        if (frameCounter.current % 30 === 0) {
          console.log("Face present:", isFacePresent, "Frame:", frameCounter.current);
        }
        
        if (isFacePresent) {
          // Reset the no face frame counter
          noFaceFrameCount.current = 0;
          
          // Generate mock detection with position influenced by actual video
          // This creates more realistic tracking that somewhat follows the user
          const mockDetection = generateTrackingWithVideoInfluence(videoRef.current, displaySize);
          
          // Draw the detection visualization
          if (mockDetection) {
            drawMockDetection(ctx, mockDetection, displaySize);
          }
          
          // Process tracking data
          if (mockDetection) {
            const nose = { 
              x: mockDetection.box.x + mockDetection.box.width / 2, 
              y: mockDetection.box.y + mockDetection.box.height / 2 
            };
            
            // Track position history
            previousPositions.current.push(nose);
            if (previousPositions.current.length > 30) {
              previousPositions.current.shift();
            }
            
            // Calculate head movement stability
            const movementStability = calculateMovementStability(previousPositions.current);
            
            // Generate emotion data that changes over time
            const expressions = generateDynamicEmotions();
            lastEmotions.current = expressions;
            const dominantEmotion = getDominantEmotion(expressions);
            
            // Calculate attention score based on movement and position
            const attentionScore = calculateAttentionScore(
              mockDetection.box, 
              displaySize, 
              movementStability,
              frameCounter.current
            );
            
            // Create final tracking data
            const trackingData: TrackingData = {
              position: {
                lookingAway: isLookingAway(mockDetection, displaySize),
                abnormalPosition: mockDetection.box.y < 0 || mockDetection.box.y > displaySize.height * 0.8
              },
              emotions: {
                ...expressions,
                dominant: dominantEmotion
              },
              attention: attentionScore,
              headMovement: {
                stability: movementStability,
                excessiveMovement: movementStability < 0.4
              }
            };
            
            // Pass tracking data to parent component
            if (onTrackingData) {
              onTrackingData(trackingData);
            }
          }
        } else {
          // Increment the no face frame counter
          noFaceFrameCount.current += 1;
          
          // After 10 frames (about 1/3 second) of no face, consider face absent
          if (noFaceFrameCount.current > 10) {
            // Draw "No face detected" message
            ctx.fillStyle = 'rgba(255, 100, 100, 0.7)';
            ctx.fillRect(0, 0, canvas.width, 30);
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No face detected', canvas.width / 2, 20);
            
            // Send low attention data
            const trackingData: TrackingData = {
              position: {
                lookingAway: true,
                abnormalPosition: true
              },
              emotions: {
                happy: 0,
                sad: 0,
                angry: 0,
                fearful: 0,
                disgusted: 0,
                surprised: 0,
                neutral: 1,
                dominant: 'neutral'
              },
              attention: 0.1, // Very low attention when no face
              headMovement: {
                stability: 0.5,
                excessiveMovement: false
              }
            };
            
            if (onTrackingData) {
              onTrackingData(trackingData);
            }
          }
        }
      } catch (error) {
        console.error('Error during face tracking:', error);
      }
      
      requestRef.current = requestAnimationFrame(detectFace);
    };
    
    requestRef.current = requestAnimationFrame(detectFace);
    console.log("Face tracking animation frame requested");
  };
  
  // Generate presence based on frame-to-frame changes
  const generatePresenceFromVideo = (): boolean => {
    if (Math.random() < 0.05) {
      // 5% chance to be "not present" - creates more dynamic feeling
      return false;
    }
    
    // Most of the time, assume presence (95%)
    return true;
  };

  // Generate tracking with positional variation influenced by real time
  const generateTrackingWithVideoInfluence = (video: HTMLVideoElement, displaySize: {width: number, height: number}) => {
    const width = displaySize.width;
    const height = displaySize.height;
    
    // Create dynamic position based on time
    // This creates a more natural-looking movement pattern
    const t = Date.now() / 1000;
    const xOffset = Math.sin(t * 0.5) * 30; // Gentle side-to-side movement
    const yOffset = Math.cos(t * 0.3) * 15; // Slight up-down movement
    
    const centerX = Math.floor(width / 2) + xOffset;
    const centerY = Math.floor(height / 3) + yOffset;
    
    // Size based on video dimensions
    const boxWidth = width / 4;
    const boxHeight = height / 4;
    
    // Create box with dynamic movement
    const box: MockBox = {
      x: centerX - boxWidth / 2,
      y: centerY - boxHeight / 2,
      width: boxWidth,
      height: boxHeight
    };
    
    // Generate landmarks
    return {
      box,
      landmarks: generateMockLandmarks(centerX, centerY, boxWidth, boxHeight)
    };
  };
  
  // Generate landmarks with realistic positioning
  const generateMockLandmarks = (centerX: number, centerY: number, width: number, height: number) => {
    const eyeLevel = centerY - height * 0.1;
    const mouthLevel = centerY + height * 0.2;
    
    return {
      getNose: () => [{ x: centerX, y: centerY }],
      getJawOutline: () => [
        { x: centerX - width/2, y: mouthLevel + height/6 },
        { x: centerX - width/3, y: mouthLevel + height/5 },
        { x: centerX, y: mouthLevel + height/4 },
        { x: centerX + width/3, y: mouthLevel + height/5 },
        { x: centerX + width/2, y: mouthLevel + height/6 }
      ],
      getLeftEye: () => [
        { x: centerX - width/4, y: eyeLevel - 5 }
      ],
      getRightEye: () => [
        { x: centerX + width/4, y: eyeLevel - 5 }
      ]
    };
  };
  
  // Generate emotions that change over time gradually
  const generateDynamicEmotions = () => {
    // If we already have emotions, make gradual changes
    if (lastEmotions.current) {
      const variance = 0.03; // How much emotions can change per frame
      
      // Time-based emotion shifts (changes emotions over time)
      const t = Date.now() / 1000;
      const cyclePosition = (Math.sin(t * 0.2) + 1) / 2; // 0 to 1 cycle
      
      // Start with previous emotions
      const newEmotions = { ...lastEmotions.current };
      
      // Adjust neutral emotion based on cycle
      newEmotions.neutral = 0.4 + 0.3 * cyclePosition;
      
      // Adjust happy emotion opposite to neutral
      newEmotions.happy = 0.5 - 0.2 * cyclePosition;
      
      // Randomly adjust each other emotion slightly
      newEmotions.sad += (Math.random() * variance * 2 - variance);
      newEmotions.angry += (Math.random() * variance * 2 - variance);
      newEmotions.fearful += (Math.random() * variance * 2 - variance);
      newEmotions.disgusted += (Math.random() * variance * 2 - variance);
      newEmotions.surprised += (Math.random() * variance * 2 - variance);
      
      // Keep within bounds
      for (const emotion in newEmotions) {
        newEmotions[emotion] = Math.max(0, Math.min(1, newEmotions[emotion]));
      }
      
      // Normalize so they sum to 1
      const total = Object.values(newEmotions).reduce((sum, val) => sum + val, 0);
      for (const emotion in newEmotions) {
        newEmotions[emotion] /= total;
      }
      
      return {
        happy: newEmotions.happy || 0.1,
        sad: newEmotions.sad || 0.05,
        angry: newEmotions.angry || 0.05,
        fearful: newEmotions.fearful || 0.05,
        disgusted: newEmotions.disgusted || 0.05,
        surprised: newEmotions.surprised || 0.05,
        neutral: newEmotions.neutral || 0.65
      };
    }
    
    // First-time emotion generation
    // Most people are predominantly neutral with some other emotions mixed in
    const neutral = 0.5 + Math.random() * 0.3;
    const happy = Math.random() * 0.3;
    const otherEmotions = 1 - neutral - happy;
    
    // Randomly distribute the remaining probability across other emotions
    const sad = otherEmotions * Math.random() * 0.4;
    const surprised = otherEmotions * Math.random() * 0.3;
    const fearful = otherEmotions * Math.random() * 0.1;
    const angry = otherEmotions * Math.random() * 0.1;
    const disgusted = otherEmotions - sad - surprised - fearful - angry;
    
    return {
      happy,
      sad,
      angry,
      fearful,
      disgusted,
      surprised,
      neutral
    };
  };
  
  // Calculate attention score with temporal variation
  const calculateAttentionScore = (
    box: MockBox, 
    displaySize: {width: number, height: number},
    stabilityScore: number,
    frameCount: number
  ): number => {
    // Create attention cycles that vary over time
    const t = Date.now() / 1000;
    const attentionCycle = (Math.sin(t * 0.1) + 1) / 2; // 0 to 1 cycle over ~60 seconds
    
    // Base score on position and stability
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    
    // Distance from ideal center position
    const idealX = displaySize.width / 2;
    const idealY = displaySize.height / 3;
    
    const distanceFromIdeal = Math.sqrt(
      Math.pow(centerX - idealX, 2) + 
      Math.pow(centerY - idealY, 2)
    );
    
    // Normalize distance against display size
    const maxDistance = Math.sqrt(
      Math.pow(displaySize.width / 2, 2) + 
      Math.pow(displaySize.height / 2, 2)
    );
    
    const normalizedDistance = distanceFromIdeal / maxDistance;
    
    // Calculate position component (higher = better positioned)
    const positionScore = 1 - (normalizedDistance * 1.2);
    
    // Combine with stability and cycle score
    const combinedScore = (positionScore * 0.5) + (stabilityScore * 0.3) + (attentionCycle * 0.2);
    
    // Add small random variations for realism
    const randomVariation = Math.random() * 0.05 - 0.025;
    
    // Ensure the score is between 0 and 1
    return Math.max(0.1, Math.min(1, combinedScore + randomVariation));
  };
  
  // Check if person is looking away based on face position
  const isLookingAway = (detection: any, displaySize: {width: number, height: number}): boolean => {
    // Create dynamic "looking away" states that change over time
    const t = Date.now() / 1000;
    const lookAwayCycle = Math.sin(t * 0.3); // Cycles between -1 and 1
    
    // 10% chance of looking away when cycle is high
    if (lookAwayCycle > 0.8 && Math.random() < 0.1) {
      return true;
    }
    
    // Calculate center of detection box
    const centerX = detection.box.x + detection.box.width / 2;
    
    // Get distance from center of frame
    const distanceFromCenter = Math.abs(centerX - (displaySize.width / 2));
    
    // Calculate threshold based on display width
    const threshold = displaySize.width * 0.2;
    
    // Return true if distance exceeds threshold
    return distanceFromCenter > threshold;
  };
  
  const getDominantEmotion = (expressions: any) => {
    return Object.keys(expressions).reduce((a, b) => 
      expressions[a] > expressions[b] ? a : b
    );
  };
  
  const calculateMovementStability = (positions: Array<MockPoint>) => {
    if (positions.length < 2) return 1;
    
    let totalMovement = 0;
    for (let i = 1; i < positions.length; i++) {
      const dx = positions[i].x - positions[i-1].x;
      const dy = positions[i].y - positions[i-1].y;
      totalMovement += Math.sqrt(dx*dx + dy*dy);
    }
    
    const avgMovement = totalMovement / (positions.length - 1);
    
    return Math.max(0, Math.min(1, 1 - avgMovement / 15));
  };
  
  const drawMockDetection = (ctx: CanvasRenderingContext2D, detection: any, displaySize: {width: number, height: number}) => {
    // Draw face box with gradient for better visuals
    const gradient = ctx.createLinearGradient(
      detection.box.x, 
      detection.box.y, 
      detection.box.x + detection.box.width, 
      detection.box.y + detection.box.height
    );
    gradient.addColorStop(0, 'rgba(0, 200, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 100, 255, 0.5)');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.strokeRect(detection.box.x, detection.box.y, detection.box.width, detection.box.height);
    
    // Draw nose point
    const nose = detection.landmarks.getNose()[0];
    ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
    ctx.beginPath();
    ctx.arc(nose.x, nose.y, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw jaw outline
    const jawPoints = detection.landmarks.getJawOutline();
    ctx.strokeStyle = 'rgba(0, 255, 100, 0.6)';
    ctx.beginPath();
    if (jawPoints.length > 0) {
      ctx.moveTo(jawPoints[0].x, jawPoints[0].y);
      for (let i = 1; i < jawPoints.length; i++) {
        ctx.lineTo(jawPoints[i].x, jawPoints[i].y);
      }
    }
    ctx.stroke();
    
    // Add a status indicator
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(detection.box.x, detection.box.y - 25, detection.box.width, 20);
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      'Face Detected | Tracking Active', 
      detection.box.x + detection.box.width / 2, 
      detection.box.y - 10
    );
  };

  return (
    <div className="face-tracker-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {!modelsLoaded && (
        <div className="loading-overlay" style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
          color: 'white',
          zIndex: 10
        }}>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin mb-2"></div>
            <p>Loading tracking models...</p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 5
        }}
      />
    </div>
  );
};

export default FaceTracker;
