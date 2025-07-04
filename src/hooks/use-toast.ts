
import { toast as sonnerToast, type ToastT } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

export function toast({
  title,
  description,
  variant = "default",
  duration = 3000,
  ...props
}: ToastProps) {
  return sonnerToast(title, {
    description,
    duration,
    className: variant === "destructive" ? "destructive" : undefined,
    ...props,
  });
}

export const useToast = () => {
  return { toast };
};
