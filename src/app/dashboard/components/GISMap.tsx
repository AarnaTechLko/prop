'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { ChevronDown } from 'lucide-react'
import { GoLocation } from 'react-icons/go';
export default function GISMapPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1">
        <Topbar />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">GIS Property Map</h2>
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by address or owner..."
                className="rounded-md border border-gray-300 px-4 py-2 text-xs w-72 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button className="absolute right-1 top-1 bottom-1 px-3 bg-orange-500 text-white rounded-md text-xs hover:bg-orange-600">
                Search
              </button>
            </div>

            {/* Toggle */}
            <label className="flex items-center gap-2 text-xs text-gray-700">
              <input type="checkbox" className="form-checkbox rounded border-gray-300" />
              Virtual Driving Mode
            </label>

            {/* Saved Parcels */}
            <button className="text-sm bg-gray-100 px-4 py-2 rounded border border-gray-300 hover:bg-gray-200">
              Saved Parcels
            </button>
          </div>
        </div>

        {/* Filters + Map */}
        <div className="flex-1 flex px-6 pb-6 gap-4 overflow-hidden">
          {/* Left - Map Section */}
          <div className="flex-1 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            {/* Filter Selectors */}
            <div className="flex items-center gap-4 bg-white px-4 py-2 border-b">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>📍 Location:</span>
                <select className="border border-gray-300 rounded px-2 py-1">
                  <option>Florida</option>
                  <option>Texas</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option>Orange</option>
                <option>Miami-Dade</option>
              </select>
            </div>

            {/* Map */}
            <MapContainer
              center={[26.8467, 80.9462]} // Lucknow
              zoom={11}
              style={{ height: 'calc(100% - 42px)', width: '100%' }}
            >
              <TileLayer
                attribution='Tiles © Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              />
            </MapContainer>

          </div>

          {/* Right - Info Panel */}

          <div className="w-[300px] rounded-lg border border-gray-200 bg-white shadow-sm p-6 flex flex-col justify-center items-center text-center">
            <GoLocation className="w-12 h-12 mb-3 text-gray-400" />
            <h3 className="text-lg font-semibold mb-1 text-gray-800">No Property Selected</h3>
            <p className="text-xs text-gray-500">
              Click on a location on the map to view property details, including parcel info, flood risk, soil data, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
