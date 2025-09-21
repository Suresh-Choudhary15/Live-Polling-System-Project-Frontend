import React from "react";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error = "",
  className = "",
  ...props
}) => {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`input ${error ? "input-error" : ""} ${className}`}
        {...props}
      />

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Input;
