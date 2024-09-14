import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Socials from "./Socials";
import BackButton from "./BackButton";

interface Props {
  children: ReactNode;
  cardTitle: string;
  backButtonhref: string;
  backButtonLabel: string;
  showSocial?: boolean;
}

export default function AuthCard({
  children,
  backButtonLabel,
  backButtonhref,
  cardTitle,
  showSocial,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={backButtonhref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
}
