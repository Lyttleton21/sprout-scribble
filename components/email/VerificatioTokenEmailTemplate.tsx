import * as React from "react";
import { Button } from "../ui/button";

interface EmailTemplateProps {
  name: string | null;
  confirmLink: string;
}

export const VerificationTokenEmailTemplate: React.FC<
  Readonly<EmailTemplateProps>
> = ({ name, confirmLink }) => (
  <div className="text-center">
    <h1>Welcome, {name ? name : "User"} 🎉</h1>
    <p>Click on the button below to confirm email address</p>

    <Button asChild variant={"link"}>
      <a
        className="text-primary underline decoration-solid"
        href={confirmLink as string}
      >
        Confirm Email
      </a>
    </Button>
  </div>
);
