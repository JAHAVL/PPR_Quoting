import React from 'react';
import styles from './LineChart.module.css';

export interface DataPoint {
  value: number;
  label: string;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  showLabels?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  height = 50,
  showLabels = false
}) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value)) * 1.1; // Add 10% padding
  const minValue = Math.min(...data.map(d => d.value)) * 0.9; // Subtract 10% padding
  const range = maxValue - minValue || 1; // Prevent division by zero
  
  // Calculate points for the SVG path
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className={styles.lineChartContainer} style={{ height: `${height}px` }}>
      <svg 
        className={styles.lineChart}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Area fill under the line */}
        <path
          d={`M0,100 L${points} L100,100 Z`}
          className={styles.areaFill}
        />
        
        {/* Line path */}
        <polyline
          points={points}
          className={styles.line}
        />
        
        {/* Data points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((d.value - minValue) / range) * 100;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              className={styles.dataPoint}
            />
          );
        })}
      </svg>
      
      {showLabels && (
        <div className={styles.labels}>
          {data.map((d, i) => (
            <div 
              key={i} 
              className={styles.label}
              style={{ 
                left: `${(i / (data.length - 1)) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {d.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LineChart;
