import { auth } from "@/server/auth";
import logo from "@/public/logo.svg";
import UserButton from "./UserButton";
import Image from "next/image";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import CartDrawer from "../cart/CartDrawer";

export default async function Nav() {
  const session = await auth();

  return (
    <header className=" py-8">
      <nav>
        <ul className="flex justify-between items-center md:gap-8 gap-4">
          <li className="flex flex-1">
            <Link href={"/"} aria-label="Logo">
              <Image src={logo} alt={"Logo"} width={150} height={10} />
            </Link>
          </li>
          <li className="relative flex items-center hover:bg-muted">
            <CartDrawer />
          </li>
          {!session ? (
            <li className="flex items-center justify-center">
              <Button asChild>
                <Link className="flex gap-2" href={"/auth/login"}>
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li className="flex items-center justify-center">
              <UserButton expires={session.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
