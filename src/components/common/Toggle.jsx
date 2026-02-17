export const Toggle = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <label className={`flex items-start gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex h-7 w-14 shrink-0
          rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out
          focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
          ${checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-6 w-6
            transform rounded-full bg-white shadow ring-0
            transition duration-200 ease-in-out
            ${checked ? 'translate-x-7' : 'translate-x-0'}
          `}
        />
      </button>
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {label}
            </span>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
    </label>
  );
};

export const Select = ({
  value,
  onChange,
  options,
  placeholder,
  className = '',
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full px-4 py-2 rounded-lg border
        bg-white dark:bg-gray-800
        border-gray-200 dark:border-gray-600
        text-gray-900 dark:text-gray-100
        focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-transparent
        transition-all duration-200
        ${className}
      `}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
