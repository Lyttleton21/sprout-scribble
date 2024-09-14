import * as React from "react";

interface EmailTemplateProps {
  name: string | null;
  confirmLink: any;
}

export const VerificationTokenEmailTemplate: React.FC<
  Readonly<EmailTemplateProps>
> = ({ name, confirmLink }) => (
  <div className="text-center">
    <h1>Welcome, {name ? name : "User"} 🎉</h1>
    <p>
      Click{" "}
      <a className="text-primary underline decoration-solid" href={confirmLink}>
        here
      </a>{" "}
      to confirm your Email
    </p>
  </div>
);
