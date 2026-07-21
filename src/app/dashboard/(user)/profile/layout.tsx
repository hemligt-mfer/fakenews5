import ProfileSidebar from "./_components/sidebar";



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="flex min-h-screen">
        <ProfileSidebar />
        <main className="flex-1 min-w-0 p-6">{children}</main>
      </div>
    </div>
  );
}