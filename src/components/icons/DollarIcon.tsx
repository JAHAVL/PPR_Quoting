import React from 'react';
import Icon, { IconProps } from './Icon';

const DollarIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Icon>
  );
};

export default DollarIcon;
