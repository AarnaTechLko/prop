import {
  Mail,
  UserPlus,
  FolderOpen,
  Search,
  Zap,
  MailOpen,
} from "lucide-react";

export default function DashboardPage() {
  return (

    <div className="max-h-screen bg-[#0c111d] text-white flex flex-col space-y-6">
      {/* Topbar */}
      <div className="flex justify-between items-center px-6 pt-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-x-2">
          <button className="px-4 py-2 border border-gray-700 bg-[#1a1f2e] rounded hover:bg-[#2a2f40] text-sm">
            Diagnostics
          </button>
          <button className="px-4 py-2 border border-gray-700 bg-[#1a1f2e] rounded hover:bg-[#2a2f40] text-sm">
            Settings
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6">
        {["Total Listings", "Active Leads", "Unread Messages", "Weekly Flip Forecast"].map((title, i) => (
          <div key={i} className="bg-[#1a1f2e] rounded p-4 shadow text-sm">
            <div className="text-white font-medium">{title}</div>
            <div className="text-gray-400 mt-1">Loading...</div>
          </div>
        ))}
      </div>

      {/* Tip of the Day */}
      <div className="bg-[#2a1f1f] border-t-4 border-yellow-500 rounded p-4 space-y-2 mx-6">
        <div className="text-sm">Tip of the Day</div>
        <div className="text-orange-400 font-semibold text-sm">Pro Strategy:</div>
        <div className="text-xs">
          Host workshops or webinars for FSBOs (For Sale By Owner) to establish expertise.
        </div>
        <button className="text-xs mt-1 px-3 py-1 bg-[#1a1f2e] border border-gray-700 rounded hover:bg-[#2a2f40]">
          Refresh Tip
        </button>
      </div>


      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-6 pb-6">
        {/* Recent Activity */}
        <div className="bg-[#1a1f2e] rounded p-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-sm font-bold">Recent Activity</div>
            <button className="text-xs px-3 py-1 border border-gray-700 rounded hover:bg-[#2a2f40]">
              View All
            </button>
          </div>
          <p className="text-gray-400 text-sm">No recent activity found</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#1a1f2e] rounded p-4">
          <div className="text-sm font-bold mb-4">Quick Actions</div>
          <div className="grid grid-cols-2 gap-3">
            <ActionButton icon={<FolderOpen className="w-4 h-4 mr-2" />} label="List Deal" />
            <ActionButton icon={<UserPlus className="w-4 h-4 mr-2" />} label="Add Lead" />
            <ActionButton icon={<Search className="w-4 h-4 mr-2" />} label="Analyze" />
            <ActionButton icon={<Zap className="w-4 h-4 mr-2" />} label="Skip Trace" />
            <ActionButton icon={<Mail className="w-4 h-4 mr-2" />} label="Email" />
            <ActionButton icon={<MailOpen className="w-4 h-4 mr-2" />} label="Training" />
          </div>
        </div>


      </div>
      <div className="w-full flex justify-end">
        <button className="text-sm text-white bg-gray-800 px-6 py-2 rounded">Report Issue</button>
      </div>

    </div>

  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center px-3 py-2 bg-[#2a2f40] text-white rounded hover:bg-[#3a3f50] text-sm font-medium">
      {icon}
      {label}
    </button>
  );
}
