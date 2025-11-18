import AccountSidebar from "./components/AccountSidebar";
import AccountHero from "./components/AccountHero";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header Hero */}
      <AccountHero />

      <div className="container mx-auto px-4 py-10 flex gap-6">
        {/* Sticky Sidebar */}
        <div className="w-1/5">
          <AccountSidebar />
        </div>

        {/* Main content area - 80% */}
        <div className="w-4/5">{children}</div>
      </div>
    </div>
  );
}
