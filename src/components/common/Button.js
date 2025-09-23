import React from "react";
import { BUTTON_VARIANTS, BUTTON_SIZES } from "../../utils/constants";

const Button = ({
  children,
  variant = BUTTON_VARIANTS.PRIMARY,
  size = BUTTON_SIZES.MEDIUM,
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case BUTTON_VARIANTS.PRIMARY:
        return "btn-primary";
      case BUTTON_VARIANTS.SECONDARY:
        return "btn-secondary";
      case BUTTON_VARIANTS.DANGER:
        return "btn-danger";
      case BUTTON_VARIANTS.SUCCESS:
        return "btn-success";
      default:
        return "btn-primary";
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case BUTTON_SIZES.SMALL:
        return "btn-sm";
      case BUTTON_SIZES.LARGE:
        return "btn-lg";
      default:
        return "";
    }
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick && onClick(e);
  };

  return (
    <button
      type={type}
      className={`btn ${getVariantClass()} ${getSizeClass()} ${className}`}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <span className="loading-spinner mr-2">
          <div className="spinner-sm"></div>
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
