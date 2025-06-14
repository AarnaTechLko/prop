export default function LeadDashboard() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Lead Dashboard</h2>
      <div className="flex space-x-4 mb-6">
        <button className="btn">Upload Leads</button>
        <button className="btn btn-primary">Score & Filter</button>
        <button className="btn">Create Lists</button>
        <button className="btn">Market</button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Lead Scoring */}
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Lead Scoring</h3>
          <p className="text-sm text-gray-600 mb-4">
            Leads are scored from 0-100 based on property details, owner motivation, and other factors.
          </p>
          <div className="flex space-x-6">
            <div>
              <span className="text-2xl font-bold">1</span>
              <p className="text-sm text-gray-500">Hot Leads (80+)</p>
            </div>
            <div>
              <span className="text-2xl font-bold">57</span>
              <p className="text-sm text-gray-500">Warm Leads (50–79)</p>
            </div>
            <div>
              <span className="text-2xl font-bold">1</span>
              <p className="text-sm text-gray-500">Cold Leads (&lt;50)</p>
            </div>
          </div>
        </div>

        {/* Threshold Filter */}
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Score Threshold Filter</h3>
          <label className="block text-sm mb-1">Min. Score: 50</label>
          <input type="range" min="0" max="100" defaultValue="50" className="w-full" />
          <p className="text-right text-sm text-gray-500 mt-2">58 leads match</p>
          <div className="mt-4 flex space-x-2">
            <button className="btn">Show Preview</button>
            <button className="btn btn-primary">Continue to Selection</button>
          </div>
        </div>
      </div>
    </div>
  );
}
