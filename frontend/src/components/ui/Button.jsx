import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = forwardRef(({
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className,
  children,
  ...props
}, ref) => {
  const base = [
    'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg border',
    'transition-all duration-150 ease-spring select-none cursor-pointer whitespace-nowrap',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tc-500/40 focus-visible:ring-offset-2',
    'disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]',
  ];

  const variants = {
    primary:   'bg-tc-500 border-tc-600 text-white hover:bg-tc-600 shadow-tc',
    secondary: 'bg-white border-line text-zinc-700 hover:bg-subtle hover:border-line-strong shadow-card',
    ghost:     'bg-transparent border-transparent text-zinc-500 hover:bg-subtle hover:text-zinc-700',
    outline:   'bg-transparent border-tc-300 text-tc-600 hover:bg-tc-50 hover:border-tc-400',
    sage:      'bg-sg-600 border-sg-700 text-white hover:bg-sg-700 shadow-sg',
    danger:    'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300',
  };

  const sizes = {
    xs: 'h-7  px-2.5 text-xs  gap-1',
    sm: 'h-8  px-3   text-sm  gap-1.5',
    md: 'h-9  px-4   text-sm  gap-1.5',
    lg: 'h-10 px-5   text-base gap-2',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={twMerge(clsx(base, variants[variant], sizes[size], className))}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin-slow h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
