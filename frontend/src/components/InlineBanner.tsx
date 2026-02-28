import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InlineBannerProps {
  variant: 'success' | 'error' | 'info';
  title?: string;
  message: string;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function InlineBanner({
  variant,
  title,
  message,
  onDismiss,
  action,
}: InlineBannerProps) {
  const styles = {
    success: {
      container: 'border-green-500/50 bg-green-50 dark:bg-green-950/20',
      icon: 'text-green-600 dark:text-green-400',
      IconComponent: CheckCircle2,
    },
    error: {
      container: 'border-destructive/50 bg-destructive/10',
      icon: 'text-destructive',
      IconComponent: AlertCircle,
    },
    info: {
      container: 'border-blue-500/50 bg-blue-50 dark:bg-blue-950/20',
      icon: 'text-blue-600 dark:text-blue-400',
      IconComponent: Info,
    },
  };

  const style = styles[variant];
  const Icon = style.IconComponent;

  return (
    <div className={`relative rounded-lg border p-4 ${style.container}`} role="alert">
      <div className="flex gap-3">
        <Icon className={`h-5 w-5 shrink-0 ${style.icon}`} />
        <div className="flex-1">
          {title && <p className="mb-1 font-semibold">{title}</p>}
          <p className="text-sm">{message}</p>
          {action && (
            <Button
              variant="outline"
              size="sm"
              onClick={action.onClick}
              className="mt-3"
            >
              {action.label}
            </Button>
          )}
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
