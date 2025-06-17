import React from 'react';
import styles from './CircleProgress.module.css';

interface CircleProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  label?: string;
}

const CircleProgress: React.FC<CircleProgressProps> = ({
  percentage,
  size = 60,
  strokeWidth = 6,
  color,
  backgroundColor = '#e6e6e6',
  showPercentage = true,
  label,
}) => {
  // Ensure percentage is between 0-100
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedPercentage / 100) * circumference;
  
  // Center position
  const center = size / 2;
  
  return (
    <div className={styles.container} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          className={styles.backgroundCircle}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          style={{ stroke: backgroundColor }}
        />
        
        {/* Progress circle */}
        <circle
          className={styles.progressCircle}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          style={{
            stroke: color || 'var(--ppr-primary)',
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
          transform={`rotate(-90 ${center} ${center})`}
        />
        
        {/* Percentage text */}
        {showPercentage && (
          <text
            className={styles.percentageText}
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {Math.round(normalizedPercentage)}%
          </text>
        )}
      </svg>
      
      {/* Optional label below the circle */}
      {label && <div className={styles.label}>{label}</div>}
    </div>
  );
};

export default CircleProgress;
