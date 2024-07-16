"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { formatRelative } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileCardActions } from "@/app/dashboard/_components/file-actions";
import Image from "next/image";
import { ReactNode } from "react";

function FileCell({ file }: { file: Doc<"files"> }) {
  const typeIcons = {
    image: <Image alt={"pdf logo"} width="20" height="0" src="/picture.svg" />,
    pdf: <Image alt={"pdf logo"} width="20" height="0" src="/pdf.svg" />,
    csv: <Image alt={"pdf logo"} width="20" height="0" src="/unknown.svg" />,
  } as Record<Doc<"files">["type"], ReactNode>;

  return (
    <div className="flex gap-2 items-center text-sm font-normal">
      <div className="flex justify-center">{typeIcons[file.type]}</div>{" "}
      {file.name}
    </div>
  );
}

function UserCell({ userId }: { userId: Id<"users"> }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: userId,
  });
  return (
    <div className="flex gap-2 text-sm text-gray-700 items-center">
      <Avatar className="w-6 h-6">
        <AvatarImage src={userProfile?.image} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {userProfile?.name}
    </div>
  );
}

export const columns: ColumnDef<Doc<"files"> & { isFavorited: boolean }>[] = [
  {
    accessorKey: "Name",
    cell: ({ row }) => {
      return <FileCell file={row.original} />;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "User",
    cell: ({ row }) => {
      return <UserCell userId={row.original.userId} />;
    },
  },
  {
    accessorKey: "Uploaded On",
    cell: ({ row }) => {
      return <div>{new Date(row.original._creationTime).toLocaleString()}</div>;
    },
  },
  {
    accessorKey: " ",
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <FileCardActions
            file={row.original}
            isFavorited={row.original.isFavorited}
          />
        </div>
      );
    },
  },
];
