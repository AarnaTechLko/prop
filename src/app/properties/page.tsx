'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../dashboard/components/Sidebar';
import Topbar from '../dashboard/components/Topbar';
import { FileText, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { FaSpinner } from 'react-icons/fa';

interface Property {
  id: number;
  name: string;
  city: string;
  state: string;
  country: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  image?: string;
}

export default function DashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/property');
        if (res.ok) {
          const data = await res.json();
          setProperties(data);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
      }
    };

    fetchProperties();
  }, []);

  const handleEdit = (id: number) => router.push(`/properties/edit/${id}`);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the property.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/property/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setProperties(prev => prev.filter(prop => prop.id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Property has been deleted.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'Unable to delete property.',
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something went wrong.',
        });
        console.error('Error deleting:', err);
      }
    }
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      // Simulate API call (replace with your real logic)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success (SweetAlert optional)
      // Swal.fire({ icon: 'success', text: 'Property Added' });
    } catch (error) {
      console.error('Error adding property:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#f9fafb] overflow-y-auto">
        <Topbar />
        <main className="p-6 flex-1 w-full">
          <div className="flex justify-between items-center mb-6 w-full">
            <h1 className="text-lg font-semibold">Property Portfolio</h1>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search properties…"
                className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
              />
              <Link href="/properties/add">
                <button
                  className={`bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded text-xs transition ${loading ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : '+ Add Property'}
                </button>

              </Link>
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 w-full">
            <div className="bg-white p-4 rounded shadow w-full">
              <p className="text-xs text-gray-500">Total Properties</p>
              <p className="text-xl font-bold">{properties.length}</p>
            </div>
            <div className="bg-white p-4 rounded shadow w-full">
              <p className="text-xs text-gray-500">Total Value</p>
              <p className="text-2xl font-bold">
                ₹{properties.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded shadow w-full">
              <p className="text-xs text-gray-500">Average Acreage</p>
              <p className="text-2xl font-bold">0.00 acres</p>
            </div>
          </section>

          <section className="bg-white p-6 rounded shadow w-full">
            <h2 className="text-md font-semibold mb-4">All Properties</h2>

            {properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-yellow-200 text-yellow-500 p-2 rounded-full mb-4">
                  <FileText size={25} />
                </div>
                <h3 className="text-lg font-bold mb-1">No properties found</h3>
                <p className="text-xs text-gray-500 mb-4">Add your first property to get started.</p>
                <Link href="/properties/add">
                  <button
                    onClick={handleClick}
                    className={`bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-xs flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin h-3 w-3" />
                        Adding...
                      </>
                    ) : (
                      '+ Add First Property'
                    )}
                  </button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="min-w-full text-xs text-left border border-gray-200 w-full">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 border border-gray-200">#</th>
                      <th className="px-4 py-2 border border-gray-200">Name</th>
                      <th className="px-4 py-2 border border-gray-200">Address</th>
                      <th className="px-4 py-2 border border-gray-200">City</th>
                      <th className="px-4 py-2 border border-gray-200">State</th>
                      <th className="px-4 py-2 border border-gray-200">Country</th>
                      <th className="px-4 py-2 border border-gray-200">Bedrooms</th>
                      <th className="px-4 py-2 border border-gray-200">Bathrooms</th>
                      <th className="px-4 py-2 border border-gray-200">Price</th>
                      <th className="px-4 py-2 border border-gray-200">Description</th>
                      <th className="px-3 py-2 border border-gray-200 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-200">{index + 1}</td>

                        <td className="px-4 py-2 border border-gray-200">{property.name}</td>
                        <td className="px-4 py-2 border border-gray-200">{property.address}</td>
                        <td className="px-4 py-2 border border-gray-200">{property.city}</td>
                        <td className="px-4 py-2 border border-gray-200">{property.state}</td>
                        <td className="px-4 py-2 border border-gray-200">{property.country}</td>
                        <td className="px-4 py-2 border border-gray-200">{property.bedrooms}</td>
                        <td className="px-4 py-2 border border-gray-200">{property.bathrooms}</td>
                        <td className="px-4 py-2 border border-gray-200">₹ {property.price.toLocaleString()}</td>
                        <td className="px-4 py-2 border border-gray-200">{property.description}</td>
                        <td className="px-4 py-2 border border-gray-200 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                              onClick={() => handleEdit(property.id)}
                              title="Edit"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              className="bg-red-300 text-white px-2 py-1 rounded text-xs hover:bg-red-400"
                              onClick={() => handleDelete(property.id)}
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
