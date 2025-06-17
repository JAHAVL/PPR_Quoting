import React from 'react';
import styles from './Icon.module.css';

export interface IconProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const Icon: React.FC<IconProps & React.SVGProps<SVGSVGElement>> = ({
  size = 'medium',
  color,
  className = '',
  children,
  ...props
}) => {
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32,
  };

  const iconSize = sizeMap[size];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${styles.icon} ${styles[size]} ${className}`}
      {...props}
    >
      {children}
    </svg>
  );
};

export default Icon;
