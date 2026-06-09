import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-background md:flex">
      <Sidebar />
      <main className="flex-1 pb-28 md:pb-10">
        <div className="mx-auto w-full max-w-3xl px-5 pt-6 md:px-10 md:pt-10">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
