'use client';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({ children, className = '', hover = false, padding = 'md', style }: CardProps) {
  return (
    <div
      className={`
        rounded-xl border border-[var(--card-border)] bg-[var(--card)]
        ${paddingClasses[padding]}
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${className}
      `}
      style={style}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-b border-[var(--card-border)] pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-lg font-semibold text-[var(--foreground)] ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-sm text-[var(--muted)] mt-1 ${className}`}>
      {children}
    </p>
  );
}
