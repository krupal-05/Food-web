import React from 'react';

const colorStyles = {
  default: 'bg-slate-100 text-slate-800 border-slate-200',
  primary: 'bg-orange-50 text-orange-700 border-orange-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
};

export const Badge = ({
  children,
  color = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeStyle = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border ${
        colorStyles[color] || colorStyles.default
      } ${sizeStyle} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            color === 'success'
              ? 'bg-emerald-500'
              : color === 'danger'
              ? 'bg-rose-500'
              : color === 'warning'
              ? 'bg-amber-500'
              : color === 'primary'
              ? 'bg-orange-500'
              : 'bg-slate-400'
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
