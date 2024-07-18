import { Button } from "@/components/ui/button";
import { CustomUserButton } from "@/components/user-button";
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
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
            <CustomUserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button
                variant={"outline"}
                className="rounded-md bg-slate-200 px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-slate-300"
              >
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
