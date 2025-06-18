'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/app/dashboard/components/Sidebar';
import Topbar from '@/app/dashboard/components/Topbar';
import Swal from 'sweetalert2';

export default function EditPropertyPage() {
  const [formData, setFormData] = useState<{
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    price: string;
    bedrooms: string;
    bathrooms: string;
    description: string;
    image: string | File;
  }>({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    image: '',
  });

  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/property/${params.id}`);
      const data = await res.json();
      console.log('API response:', data);
      setFormData(data);
    };

    fetchData();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true); // start loading

  const data = new FormData();
  for (const key in formData) {
    if (key === 'image' && formData.image instanceof File) {
      data.append('image', formData.image);
    } else {
      data.append(key, formData[key as keyof typeof formData] as string);
    }
  }

  try {
  const res = await fetch(`/api/property/${params.id}`, {
    method: 'PUT',
    body: data,
  });

  if (res.ok) {
    await Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Property updated successfully!',
      timer: 2000,
      showConfirmButton: false,
    });
    router.push('/properties');
  } else {
    let errorMessage = 'Something went wrong while updating.';
    try {
      const errorData = await res.json();
      if (errorData?.message) errorMessage = errorData.message;
    } catch (err) {
      console.error('Error parsing error response:', err);
    }

    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: errorMessage,
    });
  }
} catch (error) {
  console.error('Update failed:', error);
  Swal.fire({
    icon: 'error',
    title: 'Error!',
    text: 'Network error or server not responding.',
  });
} finally {
  setLoading(false);
}
 };
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#f9fafb] overflow-y-auto">
        <Topbar />
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Edit Property</h1>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full border border-gray-300 rounded p-2" />
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full border border-gray-300 rounded p-2" />
              <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full border border-gray-300 rounded p-2" />
              <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full border border-gray-300 rounded p-2" />
              <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="w-full border border-gray-300 rounded p-2" />
              <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full border border-gray-300 rounded p-2" />
              <input name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="Bedrooms" className="w-full border border-gray-300 rounded p-2" />
              <input name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="Bathrooms" className="w-full border border-gray-300 rounded p-2" />

            </div>



            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border border-gray-300 rounded p-2"
              rows={4}
            />


            <div className="col-span-3 flex justify-end gap-3">
             

              <button
                type="submit"
                className={`bg-yellow-500 text-white px-4 py-2 rounded text-xs ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-yellow-600'
                  }`}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Property'}
              </button>

               <button
                type="button"
                onClick={() => router.push('/properties')}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 text-xs"
                disabled={loading}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

