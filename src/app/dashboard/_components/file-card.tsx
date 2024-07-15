import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

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
              toggleFavorite({
                fileId: file._id,
              });
            }}
            className="flex gap-1 items-center cursor-pointer "
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
            >
              {file.shouldDelete ? (
                <div className="flex gap-2 items-center text-black cursor-pointer">
                  <ArchiveRestore className="w-4 h-4" /> Restore
                </div>
              ) : (
                <div className="flex gap-2 items-center text-red-600 focus:text-red-600 cursor-pointer">
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
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;

  const isFavorited = favorites.some(
    (favorite) => favorite.fileId === file._id
  );

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2">
          <div className="flex justify-center">{typeIcons[file.type]}</div>{" "}
          {file.name}
        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardActions isFavorited={isFavorited} file={file} />
        </div>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center">
        {file.type === "image" && (
          <Image alt={file.name} width="200" height="100" src={file.url} />
        )}

        {file.type === "csv" && <GanttChartIcon className="w-10 h-10" />}
        {file.type === "pdf" && <FileTextIcon className="w-10 h-10" />}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => {
            window.open(file.url, "_blank");
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
