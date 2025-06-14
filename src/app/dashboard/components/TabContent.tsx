'use client';
import { useState } from 'react';

const TabContent = () => {
  const [active, setActive] = useState('About');

  const renderContent = () => {
    switch (active) {
      case 'About':
        return (
          <div className="text-white mt-4">
            <h3 className="font-semibold text-xl mb-2">Bio</h3>
            <p className="text-sm mb-4">Land investor with 7+ years ...</p>
            <h4 className="font-semibold">Specialties</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Desert Land', 'Seller Financing', 'Subdivision', 'Zoning', 'Development', 'Wholesale'].map(tag => (
                <span key={tag} className="bg-gray-700 text-xs px-2 py-1 rounded">{tag}</span>
              ))}
            </div>
            <h4 className="mt-4 font-semibold">Statistics</h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-gray-700 p-4 rounded">Success Rate: 92%</div>
              <div className="bg-gray-700 p-4 rounded">Avg ROI: 143%</div>
              <div className="bg-gray-700 p-4 rounded">Response Time: 2.4 hrs</div>
              <div className="bg-gray-700 p-4 rounded">Joined: 2 yrs</div>
            </div>
          </div>
        );
      case 'Listings':
      case 'Posts':
      case 'Recent Deals':
        return <div className="text-white mt-4">{active} content coming soon...</div>;
      default:
        return null;
    }
  };

  return (
    <div className="mt-4">
      <div className="flex space-x-4 text-white">
        {['About', 'Recent Deals', 'Listings', 'Posts'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${active === tab ? 'bg-gray-700' : 'bg-gray-800'}`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default TabContent;
