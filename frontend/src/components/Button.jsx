import './Button.css'; // Tạo file CSS riêng nếu cần

// Component Button tái sử dụng
const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'medium', disabled = false, className = '' }) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${className}`;

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;