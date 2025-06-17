import React from 'react';
import styles from './SimpleBarChart.module.css';

interface DataPoint {
  value: number;
  label?: string;
  color?: string;
}

interface SimpleBarChartProps {
  data: DataPoint[];
  height?: number;
  showValues?: boolean;
  showLabels?: boolean;
  maxValue?: number;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  height = 60,
  showValues = false,
  showLabels = false,
  maxValue,
}) => {
  // Calculate the maximum value if not provided
  const calculatedMax = maxValue || Math.max(...data.map(item => item.value), 1);
  
  return (
    <div className={styles.chartContainer} style={{ height: `${height}px` }}>
      {data.map((item, index) => {
        const percentage = (item.value / calculatedMax) * 100;
        return (
          <div key={index} className={styles.barContainer}>
            <div 
              className={styles.bar} 
              style={{ 
                height: `${percentage}%`,
                backgroundColor: item.color || `var(--ppr-${index % 2 === 0 ? 'primary' : 'secondary'})` 
              }}
            >
              {showValues && (
                <span className={styles.value}>{item.value}</span>
              )}
            </div>
            {showLabels && item.label && (
              <div className={styles.label}>{item.label}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SimpleBarChart;
