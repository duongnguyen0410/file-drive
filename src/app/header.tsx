import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <div className="relative z-10 border-b py-1 bg-gray-50">
      <div className="flex items-center justify-between px-4">
        <Link href="/" className="flex gap-2 items-center text-xl">
          {" "}
          <Image
            src="/logo.png"
            width="50"
            height="50"
            alt="file drive logo"
          />{" "}
          FileDrive
        </Link>

        <div className="flex gap-2">
          <SignedIn>
            <OrganizationSwitcher />
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
