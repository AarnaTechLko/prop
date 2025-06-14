// import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1  bg-[#0c111d]  text-white">
        {/* <Topbar /> */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}