import React from 'react';
import styles from './ToggleSwitch.module.css';

interface ToggleSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className={`${styles.toggleSwitchContainer} ${className}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.switchWrapper}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={styles.checkbox}
        />
        <span className={styles.slider}></span>
      </div>
    </div>
  );
};

export default ToggleSwitch;
