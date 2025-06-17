import React, { ReactNode } from 'react';
import Link from 'next/link';
import styles from './DashboardCard.module.css';
import LineChart, { DataPoint } from '../visualizations/LineChart';
import CircleProgress from '../visualizations/CircleProgress';

type ChartType = 'line' | 'circle' | 'none';

interface DashboardCardProps {
  title: string;
  href: string;
  icon: ReactNode;
  description?: string;
  chartType?: ChartType;
  chartData?: DataPoint[];
  percentage?: number;
  statValue?: string | number;
  statLabel?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  href,
  icon,
  description,
  chartType = 'none',
  chartData = [],
  percentage,
  statValue,
  statLabel,
}) => {
  return (
    <div className={styles.cardWrapper}>
      <Link href={href} passHref legacyBehavior>
        <a className={styles.card}>
          <div className={styles.cardHeader}>
            {icon && <div className={styles.cardIcon}>{icon}</div>}
            <h3 className={styles.cardTitle}>{title}</h3>
          </div>
          
          {description && <p className={styles.cardDescription}>{description}</p>}
          
          {chartType === 'line' && chartData.length > 0 && (
            <div className={styles.chartContainer}>
              <LineChart 
                data={chartData}
                height={50}
                showLabels={true}
              />
            </div>
          )}

          {chartType === 'circle' && percentage !== undefined && (
            <div className={styles.chartContainer}>
              <CircleProgress 
                percentage={percentage}
                size={60}
                strokeWidth={4}
              />
            </div>
          )}
          
          {statValue && (
            <div className={styles.statValue}>
              {statValue}
              {statLabel && <span className={styles.statLabel}>{statLabel}</span>}
            </div>
          )}
        </a>
      </Link>
    </div>
  );
};

export default DashboardCard;
