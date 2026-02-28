import { ReactNode } from 'react';
import { useInViewOnce } from '../hooks/useInViewOnce';

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function MotionSection({ children, className = '', delay = 0 }: MotionSectionProps) {
  const { ref, hasEntered } = useInViewOnce();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        hasEntered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
