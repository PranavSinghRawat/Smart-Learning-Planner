import { forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({
  label, hint, error, icon: Icon, suffix,
  className, id: externalId, ...props
}, ref) => {
  const generatedId = useId();
  const id = externalId || generatedId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="t-label">{label}</label>
      )}
      <div className="relative group">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-focus-within:text-tc-500 transition-colors">
            <Icon size={14} strokeWidth={1.75} />
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={twMerge(clsx(
            'w-full h-9 rounded-lg border bg-white text-sm text-zinc-800',
            'placeholder:text-zinc-300 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-tc-500/20 focus:border-tc-400',
            error ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                  : 'border-line hover:border-line-strong',
            Icon ? 'pl-9 pr-3' : 'px-3',
            suffix ? 'pr-9' : '',
            className
          ))}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1" role="alert">
          <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />{error}
        </p>
      )}
      {hint && !error && <p className="text-xs text-zinc-400">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
