import { Doc } from "../../../../convex/_generated/dataModel";
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
  MoreVertical,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Protect } from "@clerk/nextjs";

export function FileCardActions({
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
