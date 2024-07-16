import { SideNav } from "./side-nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex">
      <div>
        <SideNav />
      </div>
      <div className="w-full pt-12">
        <div className="mx-10">{children}</div>
      </div>
    </main>
  );
}
