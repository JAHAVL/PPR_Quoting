import React from 'react';
import styles from './CircleProgress.module.css';

interface CircleProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
}

const CircleProgress: React.FC<CircleProgressProps> = ({
  percentage,
  size = 60,
  strokeWidth = 4,
  showPercentage = true
}) => {
  // SVG parameters
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Center position
  const center = size / 2;
  
  return (
    <div className={styles.circleContainer} style={{ width: size, height: size }}>
      <svg
        className={styles.circleSvg}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          className={styles.circleBackground}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          className={styles.circleProgress}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
        
        {/* Glow effect */}
        <circle
          className={styles.circleGlow}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      
      {showPercentage && (
        <div className={styles.percentageText}>
          {percentage}%
        </div>
      )}
    </div>
  );
};

export default CircleProgress;
