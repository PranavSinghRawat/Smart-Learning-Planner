import { clsx } from 'clsx';

const Divider = ({ className, label }) => {
  if (label) {
    return (
      <div className={clsx('flex items-center gap-3', className)}>
        <div className="flex-1 h-px bg-line" />
        <span className="t-label shrink-0">{label}</span>
        <div className="flex-1 h-px bg-line" />
      </div>
    );
  }
  return <div className={clsx('h-px bg-line', className)} />;
};

export default Divider;
