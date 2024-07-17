"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { FileCard } from "./file-card";
import Image from "next/image";
import { AlignJustify, Grid2X2, Loader2 } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";
import { DataTable } from "@/app/dashboard/_components/file-table";
import { columns } from "@/app/dashboard/_components/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "../../../../convex/_generated/dataModel";

function Placeholder() {
  return (
    <div className="flex flex-col gap-4 w-full items-center mt-24">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />

      <div className="text-xl text-gray-400 mb-4">
        You have no files, upload one now
      </div>
    </div>
  );
}

export function FileBrowser({
  title,
  favoritesOnly,
  deleteOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
  deleteOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          type: type === "all" ? undefined : type,
          query,
          favorites: favoritesOnly,
          delete: deleteOnly,
        }
      : "skip"
  );
  const isLoading = files === undefined;

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        <SearchBar query={query} setQuery={setQuery} />
      </div>

      <Tabs defaultValue="list">
        <div className="flex justify-between items-center">
          <div>
            <Select
              value={type}
              onValueChange={(newType) => {
                setType(newType as any);
              }}
            >
              <SelectTrigger className="w-[180px]" defaultValue={"all"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsList className="mb-2">
            <TabsTrigger value="list" className="flex gap-2 items-center">
              <AlignJustify className="w-5 h-5" />
              {/* List */}
            </TabsTrigger>
            <TabsTrigger value="grid" className="flex gap-2 items-center">
              <Grid2X2 className="w-5 h-5" />
              {/* Grid */}
            </TabsTrigger>
          </TabsList>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center mt-24 w-full">
            <div className="flex gap-3 items-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
              <div className="text-md text-gray-400">Loading...</div>
            </div>
          </div>
        ) : files?.length === 0 ? (
          <Placeholder />
        ) : (
          <>
            <TabsContent value="list">
              <DataTable columns={columns} data={modifiedFiles} />
            </TabsContent>
            <TabsContent value="grid">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-14 gap-y-4">
                {modifiedFiles?.map((file) => {
                  return <FileCard key={file._id} file={file} />;
                })}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
