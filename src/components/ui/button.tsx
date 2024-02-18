import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant = 'default', size = 'default', className, isLoading, children, ...rest } = props;

  const buttonStyles = `
    inline-flex items-center justify-center gap-2
    rounded-md text-sm font-medium
    transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
    disabled:pointer-events-none disabled:opacity-50
    ${variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90'}
    ${variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90'}
    ${variant === 'outline' && 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'}
    ${variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}
    ${variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground'}
    ${variant === 'link' && 'text-primary underline-offset-4 hover:underline'}
    ${size === 'default' && 'h-10 px-4 py-2'}
    ${size === 'sm' && 'h-9 rounded-md px-3'}
    ${size === 'lg' && 'h-11 rounded-md px-8'}
    ${size === 'icon' && 'h-10 w-10'}
    ${className}
  `;

  return (
    <button ref={ref} className={buttonStyles} {...rest}>
      <div className="flex gap-2 justify-center items-center">
        {isLoading && (
          <div className="flex space-x-2 justify-center items-center">
            <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-black rounded-full animate-bounce"></div>
          </div>
        )}
        {!isLoading && children}
      </div>
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
