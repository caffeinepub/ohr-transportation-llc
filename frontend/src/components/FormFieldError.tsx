import { AlertCircle } from 'lucide-react';

interface FormFieldErrorProps {
  message?: string;
  id?: string;
}

export default function FormFieldError({ message, id }: FormFieldErrorProps) {
  if (!message) return null;

  return (
    <div id={id} className="flex items-center gap-1.5 text-sm text-destructive" role="alert">
      <AlertCircle className="h-3.5 w-3.5" />
      <span>{message}</span>
    </div>
  );
}
