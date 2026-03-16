import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Select = forwardRef(({
  label, hint, error, className, id: externalId, children, ...props
}, ref) => {
  const generatedId = useId();
  const id = externalId || generatedId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label htmlFor={id} className="t-label">{label}</label>}
      <div className="relative">
        <select
          ref={ref} id={id}
          className={twMerge(clsx(
            'w-full h-9 rounded-lg border bg-white text-sm text-zinc-800 appearance-none pl-3 pr-8',
            'transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-tc-500/20 focus:border-tc-400',
            error ? 'border-red-300' : 'border-line hover:border-line-strong',
            className
          ))}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500" role="alert">{error}</p>}
      {hint && !error && <p className="text-xs text-zinc-400">{hint}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
