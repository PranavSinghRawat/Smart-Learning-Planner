import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  children,
  ...props
}) => {
  const variants = {
    default:     'bg-white rounded-xl shadow-card',
    flat:        'bg-subtle rounded-xl border border-line',
    'accent-tc': 'bg-tc-50 rounded-xl border border-tc-200',
    'accent-sg': 'bg-sg-50 rounded-xl border border-sg-200',
  };

  const paddings = {
    none: '',
    sm:   'p-4',
    md:   'p-5',
    lg:   'p-6',
  };

  return (
    <div
      className={twMerge(clsx(
        'transition-all duration-200 ease-spring',
        variants[variant],
        paddings[padding],
        hover && 'hover:shadow-card-hover hover:-translate-y-px cursor-pointer',
        className
      ))}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
