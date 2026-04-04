import './InputField.css';

// Component InputField tái sử dụng
const InputField = ({ label, type = 'text', value, onChange, placeholder, required = false, error, ...props }) => {
  return (
    <div className="input-field">
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`input ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default InputField;