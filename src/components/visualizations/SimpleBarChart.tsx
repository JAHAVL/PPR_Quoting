import React from 'react';
import styles from './SimpleBarChart.module.css';

export interface DataPoint {
  value: number;
  label: string;
}

interface SimpleBarChartProps {
  data: DataPoint[];
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ 
  data, 
  height = 60 
}) => {
  // Find the maximum value to normalize bars
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className={styles.chartContainer} style={{ height: `${height}px` }}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 100;
        
        return (
          <div key={index} className={styles.barGroup}>
            <div 
              className={styles.bar} 
              style={{ height: `${barHeight}%` }}
              data-value={item.value}
            >
              <div className={styles.barGlow}></div>
            </div>
            <div className={styles.label}>{item.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default SimpleBarChart;
