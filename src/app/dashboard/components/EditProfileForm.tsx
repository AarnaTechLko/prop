'use client';
import { useState } from 'react';

export default function EditProfileForm() {
  const [form, setForm] = useState({
    name: 'info',
    bio: 'Land investor with 7+ years of experience...',
    email: 'info@opulentnexus.com',
    phone: '(555) 123-4567',
    location: 'Phoenix, Arizona',
    specialties: ['Desert Land', 'Seller Financing']
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send data to API or localStorage here
    alert('Profile updated!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div>
        <label className="block mb-1 text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Bio</label>
        <textarea
          name="bio"
          rows={4}
          value={form.bio}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Phone</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Location</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
        />
      </div>

      <button type="submit" className="bg-green-500 px-4 py-2 rounded">
        Save Changes
      </button>
    </form>
  );
}
