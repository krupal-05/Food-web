import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-orange-500/25 border-transparent focus:ring-orange-500',
  secondary:
    'bg-slate-900 hover:bg-slate-800 text-white shadow-sm border-transparent focus:ring-slate-500',
  outline:
    'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400 focus:ring-slate-400',
  danger:
    'bg-rose-600 hover:bg-rose-700 text-white shadow-sm border-transparent focus:ring-rose-500',
  ghost:
    'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-transparent focus:ring-slate-400',
  success:
    'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-transparent focus:ring-emerald-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2 font-semibold',
  lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5 font-bold',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-55 active:scale-[0.98] outline-none border focus:ring-2 focus:ring-offset-2 ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
