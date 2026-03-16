import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({ label, error, icon: Icon, className, ...props }, ref) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 block">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-terracotta-500 transition-colors">
            <Icon size={20} />
          </div>
        )}
        <input
          ref={ref}
          className={twMerge(
            clsx(
              'w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 px-6 text-slate-100 transition-all font-medium placeholder:text-slate-600 focus:bg-slate-800/80',
              Icon && 'pl-14',
              error ? 'border-red-500/50 focus:border-red-500' : 'focus:border-terracotta-500/50',
              className
            )
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-bold text-red-500 pl-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
