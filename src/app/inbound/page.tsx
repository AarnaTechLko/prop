'use client';
import Sidebar from '../dashboard/components/Sidebar';
import Topbar from '../dashboard/components/Topbar';

export default function InboundPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-y-auto bg-[#f8f7f5] p-6 text-black">
          {/* Page Title */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Ultimate Inbound System</h1>
            <p className="text-sm text-gray-500">AI-powered lead management and communication</p>
          </div>

          {/* Firehose Header */}
          <div className="flex justify-between items-center bg-white px-6 py-4 rounded-t-lg border border-gray-200">
            <div>
              <h2 className="text-lg font-semibold">Inbound Firehose</h2>
              <p className="text-xs text-gray-500">59 active leads • 0 hot leads</p>
            </div>
            <div className="flex items-center gap-4">
              <select className="border text-sm rounded px-2 py-1 text-black border-gray-300">
                <option>All time</option>
              </select>
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                className="border text-sm rounded px-3 py-1 text-black border-gray-300"
              />
            </div>
          </div>

          {/* Lead Cards */}
          <div className="bg-white border-x border-b border-gray-200 p-4 space-y-4 rounded-b-lg">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 p-4 rounded-md flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-sm">No address</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">Schedule</button>
                  <button className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Unknown</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
