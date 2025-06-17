import React from 'react';
import styles from './TextField.module.css';

interface TextFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  required,
  disabled,
  className,
}) => {
  return (
    <div className={`${styles.formGroup} ${className || ''}`}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        required={required}
        disabled={disabled}
        className={styles.input}
      />
    </div>
  );
};

export default TextField;
