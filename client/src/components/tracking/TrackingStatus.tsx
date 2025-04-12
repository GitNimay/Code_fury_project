import React, { useState } from 'react';
import { AnalysisResult } from './TrackingAnalyzer';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle, Eye, Crosshair, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrackingStatusProps {
  analysis: AnalysisResult | null;
  expanded?: boolean;
}

const TrackingStatus: React.FC<TrackingStatusProps> = ({ 
  analysis, 
  expanded: initialExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  
  if (!analysis) {
    return (
      <div className="tracking-status p-3 bg-white/80 backdrop-blur-sm shadow-md rounded-lg border border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Waiting for tracking data...</span>
          <div className="animate-pulse w-4 h-4 bg-blue-400 rounded-full"></div>
        </div>
      </div>
    );
  }
  
  const { attention, emotionState, posture, suspiciousActivity } = analysis;
  
  // Format attention score as percentage
  const attentionPercent = Math.round(attention * 100);
  
  // Determine attention status text and color
  const getAttentionStatus = () => {
    if (attentionPercent >= 80) return { text: 'Excellent', color: 'text-emerald-500' };
    if (attentionPercent >= 60) return { text: 'Good', color: 'text-emerald-400' };
    if (attentionPercent >= 40) return { text: 'Average', color: 'text-amber-400' };
    return { text: 'Low', color: 'text-red-500' };
  };
  
  const attentionStatus = getAttentionStatus();
  
  // Format posture status
  const getPostureStatusInfo = () => {
    switch (posture) {
      case 'good':
        return { 
          text: 'Good Posture', 
          color: 'text-emerald-500',
          bgColor: 'bg-emerald-500',
          description: 'Your posture is excellent. Keep it up!'
        };
      case 'slouching':
        return { 
          text: 'Slouching', 
          color: 'text-amber-500',
          bgColor: 'bg-amber-500',
          description: 'Try sitting up straighter to improve your posture.'
        };
      case 'too_close':
        return { 
          text: 'Too Close', 
          color: 'text-amber-500',
          bgColor: 'bg-amber-500',
          description: 'You are sitting too close to the camera. Try moving back a bit.'
        };
      case 'too_far':
        return { 
          text: 'Too Far', 
          color: 'text-amber-500',
          bgColor: 'bg-amber-500',
          description: 'You are sitting too far from the camera. Try moving closer.'
        };
      default:
        return { 
          text: 'Unknown', 
          color: 'text-gray-500',
          bgColor: 'bg-gray-500',
          description: 'Unable to analyze your posture. Make sure you are visible in the frame.'
        };
    }
  };
  
  const postureStatus = getPostureStatusInfo();
  
  // Format emotion status
  const getEmotionColor = () => {
    switch (emotionState) {
      case 'happy':
        return 'text-emerald-500';
      case 'neutral':
        return 'text-blue-500';
      case 'surprised':
        return 'text-amber-500';
      case 'sad':
      case 'angry':
      case 'fearful':
      case 'disgusted':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  const emotionColor = getEmotionColor();
  
  // Format emotion display name
  const getEmotionName = () => {
    if (emotionState === 'unknown') return 'Analyzing...';
    return emotionState.charAt(0).toUpperCase() + emotionState.slice(1);
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="tracking-status overflow-hidden bg-white/90 backdrop-blur-sm shadow-md rounded-lg border border-gray-200 dark:bg-gray-800/90 dark:border-gray-700 transition-all duration-300">
      {/* Summary bar - always visible */}
      <div 
        className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
        onClick={toggleExpand}
      >
        <div className="flex items-center space-x-2">
          {suspiciousActivity ? (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          )}
          <span className="font-medium text-sm">
            {suspiciousActivity 
              ? 'Attention needed!' 
              : 'Tracking active'}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Attention indicator */}
          <div className="flex items-center">
            <Brain className="w-4 h-4 text-gray-500 mr-1.5" />
            <span className={`text-sm font-medium ${attentionStatus.color}`}>
              {attentionPercent}%
            </span>
          </div>
          
          {/* Emotion indicator */}
          <div className="flex items-center">
            <Eye className="w-4 h-4 text-gray-500 mr-1.5" />
            <span className={`text-sm font-medium ${emotionColor}`}>
              {getEmotionName()}
            </span>
          </div>
          
          {/* Posture indicator */}
          <div className="flex items-center">
            <Crosshair className="w-4 h-4 text-gray-500 mr-1.5" />
            <span className={`text-sm font-medium ${postureStatus.color}`}>
              {postureStatus.text}
            </span>
          </div>
          
          <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>
      
      {/* Detailed info - only visible when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Attention section */}
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attention Level</h4>
              <div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    attentionPercent >= 80 ? 'bg-emerald-500' : 
                    attentionPercent >= 60 ? 'bg-emerald-400' : 
                    attentionPercent >= 40 ? 'bg-amber-400' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${attentionPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your attention is {attentionStatus.text.toLowerCase()}. 
                {attentionPercent < 60 && ' Try to focus more on the interview.'}
              </p>
            </div>
            
            {/* Emotion section */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Emotional State</h4>
              <div className={`text-sm ${emotionColor} font-medium`}>
                {getEmotionName()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {emotionState === 'happy' && 'You appear positive and engaged.'}
                {emotionState === 'neutral' && 'You appear calm and composed.'}
                {emotionState === 'surprised' && 'You appear surprised or puzzled.'}
                {emotionState === 'sad' && 'You appear somewhat downcast.'}
                {emotionState === 'angry' && 'You appear frustrated or upset.'}
                {emotionState === 'fearful' && 'You appear anxious or nervous.'}
                {emotionState === 'disgusted' && 'You appear displeased or uncomfortable.'}
                {emotionState === 'unknown' && 'Still analyzing your emotional state...'}
              </p>
            </div>
            
            {/* Posture section */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Posture</h4>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${postureStatus.bgColor}`}></div>
                <span className={`text-sm font-medium ${postureStatus.color}`}>
                  {postureStatus.text}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {postureStatus.description}
              </p>
            </div>
            
            {/* Suspicious activity warning if needed */}
            {suspiciousActivity && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    Suspicious activity detected
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                    The system has detected behavior that may indicate looking away from the screen or consulting external resources.
                    Please maintain focus on the interview.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrackingStatus;
