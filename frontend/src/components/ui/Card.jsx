import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ className, children, padding = 'p-8', glass = true, hover = true, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-[2.5rem] border border-white/5 transition-all duration-300',
          glass && 'glass',
          !glass && 'bg-slate-800/50',
          hover && 'hover:border-terracotta-500/20 hover:scale-[1.01] hover:shadow-2xl hover:shadow-black/40',
          padding,
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
