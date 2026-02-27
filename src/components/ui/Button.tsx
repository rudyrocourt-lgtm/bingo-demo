import { cn } from '../../lib/utils';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200',
        'hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200',
        variant === 'secondary' && 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300',
        variant === 'ghost' && 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-5 py-2.5 text-base',
        size === 'lg' && 'px-8 py-4 text-lg',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
