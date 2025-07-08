// src/components/Input.jsx
import React from 'react';
import './Input.css';

const Input = ({ id, type, value, onChange, placeholder, required, className, ...props }) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`custom-input ${className || ''}`}
      {...props}
    />
  );
};

export default Input;