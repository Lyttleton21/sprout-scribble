import { CheckCircle2 } from "lucide-react";

interface Props {
  message?: string;
}

const FormSuccess = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div className="bg-teal-400/25 flex text-xs font-medium my-4 items-center gap-2 text-secondary-foreground p-3 rounded-md">
      <CheckCircle2 className="w-4 h-4" />
      <p>{message} 🎉</p>
    </div>
  );
};

export default FormSuccess;
