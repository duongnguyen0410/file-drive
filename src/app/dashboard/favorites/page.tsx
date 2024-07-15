import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { FileBrowser } from "../_components/file-browser";

export default function FavoritesPage() {

  return (
    <div>
      <FileBrowser title="Favorites" favoritesOnly />
    </div>
  );
}
