"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignInButton, useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { LogOut, UserRoundIcon } from "lucide-react";

function UserButtonMenu() {
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  const { user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="w-9 h-9">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className=" mt-1 w-[300px] rounded-xl border border-gray-200 bg-white px-2 py-4 text-black drop-shadow-2xl"
      >
        <DropdownMenuItem className="mb-2">
          <div className="flex items-center">
            <Avatar className="w-9 h-9">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <p className="text-xs font-semibold">{user?.fullName}</p>
              <p className="text-xs text-gray-500">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-200"/>

        <DropdownMenuItem
          onClick={() => openUserProfile()}
          className="flex items-center py-3 text-xs cursor-pointer"
        >
          <div className="pl-2.5 flex items-center gap-6">
            <UserRoundIcon className="w-4 h-4" />
            Profile
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => signOut(() => router.push("/"))}
          className="flex items-center py-3 text-xs cursor-pointer"
        >
          <div className="pl-2.5 flex items-center gap-6">
            <LogOut className="w-4 h-4" />
            Sign out
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CustomUserButton() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!user?.id) return <SignInButton />;

  return <UserButtonMenu />;
}
