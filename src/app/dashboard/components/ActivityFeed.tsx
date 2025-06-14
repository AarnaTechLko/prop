export default function ActivityFeed() {
  return (
    <div className="bg-black rounded-xl p-6 border border-gray-800">
      <h3 className="text-xl font-semibold mb-4">Activity Feed</h3>
      <div className="space-y-4">
        <div>
          <p className="font-medium">Campaign &quot;Out-of-State Owners&quot; activated</p>
          <p className="text-sm text-gray-400">Apr 23, 10:08 AM</p>
        </div>
        <div>
          <p className="font-medium">New message from John Williams</p>
          <p className="text-sm text-gray-400">Apr 23, 03:58 AM</p>
        </div>
        <div>
          <p className="font-medium">New message from David Johnson</p>
          <p className="text-sm text-gray-400">Apr 23, 10:32 AM</p>
        </div>
      </div>
    </div>
  );
}
