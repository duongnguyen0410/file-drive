import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  ArchiveRestore,
  Download,
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import { ReactNode, use, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Protect } from "@clerk/nextjs";

function FileCardActions({
  file,
  isFavorited,
}: {
  file: Doc<"files">;
  isFavorited: boolean;
}) {
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);

  const { toast } = useToast();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for our deletion process. Files are
              deleted peroidically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({
                  fileId: file._id,
                });
                toast({
                  variant: "default",
                  title: "File deleted",
                  description: "Your file will be deleted soon",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="w-5 h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              window.open(file.url, "_blank");
            }}
            className="flex gap-2 items-center cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              toggleFavorite({
                fileId: file._id,
              });
            }}
            className="cursor-pointer"
          >
            {isFavorited ? (
              <div className="flex gap-2 items-center">
                <StarIcon fill="black" className="w-4 h-4 text-black" />{" "}
                Unfavorite
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <StarIcon className="w-4 h-4" /> Favorite
              </div>
            )}
          </DropdownMenuItem>
          <Protect role={"org:admin"} fallback={<></>}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                file.shouldDelete
                  ? restoreFile({
                      fileId: file._id,
                    })
                  : setIsConfirmOpen(true);
              }}
              className="cursor-pointer"
            >
              {file.shouldDelete ? (
                <div className="flex gap-2 items-center text-black">
                  <ArchiveRestore className="w-4 h-4" /> Restore
                </div>
              ) : (
                <div className="flex gap-2 items-center text-red-600 focus:text-red-600">
                  <Trash2Icon className="w-4 h-4" /> Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export function FileCard({
  file,
  favorites,
}: {
  file: Doc<"files">;
  favorites: Doc<"favorites">[];
}) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  const typeIcons = {
    image: <Image alt={"pdf logo"} width="27" height="0" src="/picture.svg" />,
    pdf: <Image alt={"pdf logo"} width="27" height="0" src="/pdf.svg" />,
    csv: <Image alt={"pdf logo"} width="27" height="0" src="/unknown.svg" />,
  } as Record<Doc<"files">["type"], ReactNode>;

  const isFavorited = favorites.some(
    (favorite) => favorite.fileId === file._id
  );

  return (
    <Card className="w-[330px]">
      <CardHeader className="relative">
        <CardTitle className="flex justify-between">
          <div className="flex gap-2 items-center text-base font-normal">
            <div className="flex justify-center">{typeIcons[file.type]}</div>{" "}
            {file.name}
          </div>
          <div className="flex items-center">
            <FileCardActions isFavorited={isFavorited} file={file} />
          </div>
        </CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent className="h-[230px] flex justify-center items-center">
        {file.type === "image" && (
          <Image alt={file.name} width="200" height="100" src={file.url} />
        )}

        {file.type === "csv" && <GanttChartIcon className="w-10 h-10" />}
        {file.type === "pdf" && <FileTextIcon className="w-10 h-10" />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
          <Avatar className="w-6 h-6">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className="text-xs">
          Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  );
}
