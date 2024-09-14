import { AlertCircle } from "lucide-react";

interface Props {
  message?: string;
}

const FormError = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div className="bg-destructive flex text-xs font-medium my-2 items-center gap-2 text-secondary-foreground p-3 rounded-md">
      <AlertCircle className="w-4 h-4" />
      <p>{message} 🎉</p>
    </div>
  );
};

export default FormError;
