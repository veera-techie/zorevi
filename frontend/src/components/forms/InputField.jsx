import React from 'react';

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon: Icon,
  helperText,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-[#1E1B2E]">
          {label} {required && <span className="text-[#EF4444]">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-zorevi-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7280]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full text-sm bg-white border rounded-xl py-2.5 transition focus:outline-none focus:ring-2 focus:ring-[#6B35D9]/20 focus:border-[#6B35D9] ${
            Icon ? 'pl-10 pr-3.5' : 'px-3.5'
          } ${
            error
              ? 'border-[#EF4444] text-[#EF4444]'
              : 'border-[#EAE4F5] text-[#1E1B2E] hover:border-[#D9D2E9]'
          } ${disabled ? 'bg-[#F9FAFB] cursor-not-allowed text-[#9CA3AF]' : ''}`}
        />
      </div>
      {error && <p className="text-[11px] text-[#EF4444]">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-[#6B7280]">{helperText}</p>}
    </div>
  );
};

export default InputField;
