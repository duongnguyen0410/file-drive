"use client";

import { UploadButton } from "@/app/dashboard/_components/upload-button";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav() {
  const pathName = usePathname();

  return (
    <div className="w-[250px] flex flex-col gap-4 border-r border-gray-200 min-h-screen">
      <div className="pt-12">
        <div className="mb-8 flex justify-center">
          <UploadButton />
        </div>
        <div className="ml-6 mb-2">
          <Link href="/dashboard/files">
            <Button
              variant={"link"}
              className={clsx("flex gap-4 font-semibold", {
                "text-blue-600": pathName.includes("/dashboard/files"),
              })}
            >
              <FileIcon className="w-5 h-5" />
              All Files
            </Button>
          </Link>
        </div>

        <div className="ml-6 mb-2">
          <Link href="/dashboard/favorites">
            <Button
              variant={"link"}
              className={clsx("flex gap-4 font-semibold", {
                "text-blue-600": pathName.includes("/dashboard/favorites"),
              })}
            >
              <StarIcon className="w-5 h-5" />
              Favorites
            </Button>
          </Link>
        </div>

        <div className="ml-6 mb-2">
          <Link href="/dashboard/trash">
            <Button
              variant={"link"}
              className={clsx("flex gap-4 font-semibold", {
                "text-blue-600": pathName.includes("/dashboard/trash"),
              })}
            >
              <Trash2 className="w-5 h-5" />
              Trash
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
