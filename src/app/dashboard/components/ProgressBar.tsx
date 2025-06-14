export default function ProgressBar() {
  const stages = ['New Leads', 'Offers Sent', 'Under Contract', 'Closed']

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-800">
      <h3 className="text-xl font-semibold mb-4">Lead Pipeline Progress</h3>
      {stages.map((stage, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between">
            <span>{stage}</span>
            <span>1 lead</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 mt-1">
            <div className="bg-green-500 h-2 rounded-full w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}