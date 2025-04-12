import { TrackingData } from './FaceTracker';

export interface AnalysisResult {
  attention: number;
  emotionState: string;
  posture: string;
  suspiciousActivity: boolean;
  movementScore: number;
}

export interface TrackingReport {
  averageAttention: number;
  emotionBreakdown: { [key: string]: number };
  dominantEmotion: string;
  postureSummary: {
    good: number;
    slouching: number;
    tooClose: number;
    tooFar: number;
  };
  suspiciousActivityCount: number;
  totalFrames: number;
  startTime: Date;
  endTime: Date;
  duration: number; // seconds
}

interface PostureData {
  slouching: boolean;
  tooClose: boolean;
  tooFar: boolean;
}

// Holds history for calculating moving averages
let attentionHistory: number[] = [];
let emotionHistory: string[] = [];
let postureHistory: string[] = [];
let suspiciousActivityHistory: boolean[] = [];

// Report data
let totalAttention = 0;
let emotionCounts: { [key: string]: number } = {};
let postureCounts: { good: number; slouching: number; tooClose: number; tooFar: number } = {
  good: 0,
  slouching: 0,
  tooClose: 0,
  tooFar: 0
};
let suspiciousCount = 0;
let frameCount = 0;
let reportStartTime: Date | null = null;

/**
 * Analyzes face and pose tracking data to provide unified insights
 */
export class TrackingAnalyzer {
  // Configuration
  private historyLength: number = 30; // Number of frames to keep in history
  private attentionThreshold: number = 0.6; // Threshold for good attention
  private emotionChangeThreshold: number = 3; // Frames needed to confirm emotion change
  private suspiciousThreshold: number = 0.45; // Threshold for suspicious activity
  
  constructor() {
    this.resetHistory();
  }
  
  private resetHistory() {
    attentionHistory = [];
    emotionHistory = [];
    postureHistory = [];
    suspiciousActivityHistory = [];
    
    // Reset report data
    totalAttention = 0;
    emotionCounts = {};
    postureCounts = { good: 0, slouching: 0, tooClose: 0, tooFar: 0 };
    suspiciousCount = 0;
    frameCount = 0;
    reportStartTime = new Date();
  }
  
  /**
   * Start tracking for a new session
   */
  public startTracking() {
    this.resetHistory();
    reportStartTime = new Date();
    console.log("Tracking started at", reportStartTime);
  }
  
  /**
   * Analyze data from face and pose tracking
   */
  public analyze(faceData: TrackingData | null, poseData: PostureData | null): AnalysisResult {
    frameCount++;
    
    // Default values if no tracking data
    let analysis: AnalysisResult = {
      attention: 0.5,
      emotionState: "unknown",
      posture: "unknown",
      suspiciousActivity: false,
      movementScore: 0.5
    };
    
    // Process face tracking data
    if (faceData) {
      // Process attention
      const rawAttention = faceData.attention;
      attentionHistory.push(rawAttention);
      if (attentionHistory.length > this.historyLength) {
        attentionHistory.shift();
      }
      
      // Calculate smoothed attention (weighted moving average)
      let weightedSum = 0;
      let weightSum = 0;
      for (let i = 0; i < attentionHistory.length; i++) {
        const weight = (i + 1); // More recent frames have higher weight
        weightedSum += attentionHistory[i] * weight;
        weightSum += weight;
      }
      const smoothedAttention = weightedSum / weightSum;
      
      // Update attention in analysis result
      analysis.attention = smoothedAttention;
      totalAttention += smoothedAttention;
      
      // Process emotion
      const currentEmotion = faceData.emotions.dominant;
      emotionHistory.push(currentEmotion);
      if (emotionHistory.length > this.historyLength) {
        emotionHistory.shift();
      }
      
      // Only change emotion when it's stable for several frames
      const emotionCounts: { [key: string]: number } = {};
      emotionHistory.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
      
      let dominantEmotion = "neutral";
      let maxCount = 0;
      
      Object.entries(emotionCounts).forEach(([emotion, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantEmotion = emotion;
        }
      });
      
      // Make sure the emotion is stable enough before changing
      if (maxCount >= this.emotionChangeThreshold) {
        analysis.emotionState = dominantEmotion;
      } else if (emotionHistory.length < this.emotionChangeThreshold) {
        // Not enough history yet
        analysis.emotionState = dominantEmotion;
      }
      
      // Update emotion count for reporting
      if (!emotionCounts[analysis.emotionState]) {
        emotionCounts[analysis.emotionState] = 0;
      }
      emotionCounts[analysis.emotionState]++;
      
      // Calculate head movement score
      analysis.movementScore = faceData.headMovement.stability;
    }
    
    // Process posture data
    if (poseData) {
      let currentPosture = "good";
      
      if (poseData.slouching) {
        currentPosture = "slouching";
      } else if (poseData.tooClose) {
        currentPosture = "too_close";
      } else if (poseData.tooFar) {
        currentPosture = "too_far";
      }
      
      postureHistory.push(currentPosture);
      if (postureHistory.length > this.historyLength) {
        postureHistory.shift();
      }
      
      // Only change posture assessment when it's stable for several frames
      const postureCounts: { [key: string]: number } = {};
      postureHistory.forEach(posture => {
        postureCounts[posture] = (postureCounts[posture] || 0) + 1;
      });
      
      let dominantPosture = "good";
      let maxCount = 0;
      
      Object.entries(postureCounts).forEach(([posture, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantPosture = posture;
        }
      });
      
      analysis.posture = dominantPosture;
      
      // Update posture counts for reporting
      if (dominantPosture === "good") {
        postureCounts.good++;
      } else if (dominantPosture === "slouching") {
        postureCounts.slouching++;
      } else if (dominantPosture === "too_close") {
        postureCounts.tooClose++;
      } else if (dominantPosture === "too_far") {
        postureCounts.tooFar++;
      }
    }
    
    // Detect suspicious activity
    let isSuspicious = false;
    
    // Low attention combined with unusual head movement or extreme emotion
    if (analysis.attention < this.suspiciousThreshold) {
      isSuspicious = true;
    }
    
    // Looking away combined with certain emotions can indicate suspicious behavior
    if (faceData?.position.lookingAway && 
        (analysis.emotionState === "surprised" || 
        analysis.emotionState === "fearful" ||
        analysis.emotionState === "nervous")) {
      isSuspicious = true;
    }
    
    // Excessive head movement can indicate looking at notes or other resources
    if (faceData?.headMovement.excessiveMovement) {
      isSuspicious = true;
    }
    
    suspiciousActivityHistory.push(isSuspicious);
    if (suspiciousActivityHistory.length > this.historyLength) {
      suspiciousActivityHistory.shift();
    }
    
    // Only flag suspicious activity if it persists for several frames
    const suspiciousFrames = suspiciousActivityHistory.filter(Boolean).length;
    analysis.suspiciousActivity = suspiciousFrames > (this.historyLength / 3);
    
    if (analysis.suspiciousActivity) {
      suspiciousCount++;
    }
    
    return analysis;
  }
  
  /**
   * Generate a report of tracking data for the session
   */
  public generateReport(): TrackingReport {
    const endTime = new Date();
    const duration = (endTime.getTime() - (reportStartTime?.getTime() || endTime.getTime())) / 1000;
    
    // Calculate average attention
    const avgAttention = totalAttention / Math.max(1, frameCount);
    
    // Create emotion breakdown
    const emotionBreakdown: { [key: string]: number } = {};
    let dominantEmotion = "neutral";
    let maxEmotionCount = 0;
    
    Object.entries(emotionCounts).forEach(([emotion, count]) => {
      emotionBreakdown[emotion] = count / Math.max(1, frameCount);
      if (count > maxEmotionCount) {
        maxEmotionCount = count;
        dominantEmotion = emotion;
      }
    });
    
    // Normalize posture counts
    const postureSummary = {
      good: postureCounts.good / Math.max(1, frameCount),
      slouching: postureCounts.slouching / Math.max(1, frameCount),
      tooClose: postureCounts.tooClose / Math.max(1, frameCount),
      tooFar: postureCounts.tooFar / Math.max(1, frameCount)
    };
    
    return {
      averageAttention: avgAttention,
      emotionBreakdown,
      dominantEmotion,
      postureSummary,
      suspiciousActivityCount: suspiciousCount,
      totalFrames: frameCount,
      startTime: reportStartTime || new Date(),
      endTime,
      duration
    };
  }
}

export default TrackingAnalyzer;
