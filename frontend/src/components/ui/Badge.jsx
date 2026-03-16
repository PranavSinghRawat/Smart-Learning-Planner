import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Badge = ({ variant = 'default', size = 'sm', dot = false, className, children, ...props }) => {
  const variants = {
    default: 'bg-zinc-100 border-zinc-200 text-zinc-600',
    tc:      'bg-tc-50   border-tc-200   text-tc-700',
    sg:      'bg-sg-50   border-sg-200   text-sg-700',
    amber:   'bg-amber-50  border-amber-200  text-amber-700',
    red:     'bg-red-50    border-red-200    text-red-600',
    blue:    'bg-blue-50   border-blue-200   text-blue-600',
    purple:  'bg-purple-50 border-purple-200 text-purple-600',
  };

  const dots = {
    default: 'bg-zinc-400', tc: 'bg-tc-500', sg: 'bg-sg-500',
    amber: 'bg-amber-500', red: 'bg-red-500', blue: 'bg-blue-500', purple: 'bg-purple-500',
  };

  const sizes = { sm: 'h-5 px-2 text-2xs', md: 'h-6 px-2.5 text-xs' };

  return (
    <span className={twMerge(clsx(
      'inline-flex items-center gap-1 font-medium rounded-md border',
      variants[variant], sizes[size], className
    ))} {...props}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse-dot', dots[variant])} aria-hidden="true" />}
      {children}
    </span>
  );
};

export default Badge;
