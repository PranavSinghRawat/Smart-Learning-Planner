import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Badge = ({ className, variant = 'default', children, ...props }) => {
  const baseStyles = 'px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase inline-flex items-center gap-1.5';
  
  const variants = {
    default: 'bg-slate-800 text-slate-400',
    primary: 'bg-terracotta-500/10 text-terracotta-500 ring-1 ring-terracotta-500/20',
    success: 'bg-sage-500/10 text-sage-500 ring-1 ring-sage-500/20',
    warning: 'bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20',
    danger: 'bg-red-500/10 text-red-500 ring-1 ring-red-500/20',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </span>
  );
};

export default Badge;
