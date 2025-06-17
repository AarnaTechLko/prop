'use client';

import Sidebar from '@/app/dashboard/components/Sidebar';
import Topbar from '@/app/dashboard/components/Topbar';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function PropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>(''); // for styling
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: 'House',
    country: '',
    state: '',
    city: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));


    try {
      const res = await fetch('/api/property', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Property added!',
          text: '✅ Property added successfully!',
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          router.push('/properties');
        }, 1600);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Add failed',
          text: '❌ Failed to add property.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: '⚠️ Error submitting property.',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#f9fafb] overflow-y-auto">
        <Topbar />
        <main className="p-6 flex-1">
          <div className="bg-white shadow-lg p-6 rounded-xl max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Add Property</h2>
            {message && (
              <div
                className={`col-span-3 p-3 rounded text-center ${messageType === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 text-xs">
              <input
                className="border border-gray-200 p-2 rounded"
                name="name"
                placeholder="Property Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                className="border border-gray-200 p-2 rounded"
                name="price"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <select
                className="border border-gray-200 p-2 rounded"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option>House</option>
                <option>Flat</option>
                <option>Land</option>
              </select>
              <input
                className="border border-gray-200 p-2 rounded"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                required
              />
              <input
                className="border border-gray-200 p-2 rounded"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
              />
              <input
                className="border border-gray-200 p-2 rounded"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <input
                className="border border-gray-200 p-2 rounded"
                name="bedrooms"
                type="number"
                placeholder="Bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                required
              />
              <input
                className="border border-gray-200 p-2 rounded"
                name="bathrooms"
                type="number"
                placeholder="Bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                required
              />
              <input
                className="border border-gray-200 p-2 rounded"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <textarea
                className="border border-gray-200 p-2 rounded col-span-3"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <div className="flex gap-3 justify-end col-span-3">
                

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`bg-yellow-500 text-white py-1.5 px-3 rounded text-xs hover:bg-yellow-600 ${loading ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Property'}
                </button>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => router.back()} // or router.push('/properties')
                  className="bg-gray-300 text-gray-800 py-1.5 px-3 rounded text-xs hover:bg-gray-400"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>


            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
