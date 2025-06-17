import React from 'react';
import styles from './BackgroundAnimation.module.css';

const BackgroundAnimation: React.FC = () => {
  return (
    <div className={styles.backgroundAnimation}>
      {/* Gradient divs removed, border and glow handled by CSS on parent */}
    </div>
  );
};

export default BackgroundAnimation;
