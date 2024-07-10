"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UploadButton } from "@/app/upload-button";
import { FileCard } from "@/app/file-card";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const isLoading = files === undefined;

  return (
    <main className="container mx-auto pt-12">
      {isLoading && (
        <div className="flex justify-center items-center mt-24 w-full">
          <div className="flex gap-3 items-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
            <div className="text-md text-gray-400">Loading...</div>
          </div>
        </div>
      )}

      {!isLoading && files.length === 0 && (
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

          <UploadButton />
        </div>
      )}
      {!isLoading && files.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <UploadButton />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {files?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </>
      )}
    </main>
  );
}
