import React from 'react';
import Icon, { IconProps } from './Icon';

const CalculateIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="16" y2="14" />
      <line x1="8" y1="18" x2="12" y2="18" />
    </Icon>
  );
};

export default CalculateIcon;
