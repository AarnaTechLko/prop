"use client";

import { useState } from "react";
import Sidebar from "../dashboard/components/Sidebar";
import Topbar from "../dashboard/components/Topbar";

interface Lead {
  name: string;
  email: string;
  property: string;
  location: string;
  status: string;
  score: string;
  lastContact: string;
}

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [formData, setFormData] = useState<Lead>({
    name: "",
    email: "",
    property: "",
    location: "",
    status: "New",
    score: "",
    lastContact: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (res.ok) {
      setLeads((prev) => [...prev, formData]);
      setFormData({
        name: "",
        email: "",
        property: "",
        location: "",
        status: "New",
        score: "",
        lastContact: "",
      });
      setShowForm(false);
    } else {
      console.error("Failed to add lead:", result.message);
    }
  } catch (error) {
    console.error("Error submitting lead:", error);
  }
};


  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-[#1f2937] text-white overflow-auto">
        <Topbar />

        <div className="p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Lead CRM + Sniper Score</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {showForm ? "Close Form" : "+ Add Lead"}
            </button>
          </header>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-[#111827] p-6 rounded-lg mb-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
                />
                <input
                  name="property"
                  value={formData.property}
                  onChange={handleChange}
                  placeholder="Property"
                  className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
                />
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
                />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
                >
                  <option>New</option>
                  <option>Offer Sent</option>
                  <option>Under Contract</option>
                  <option>Closed</option>
                </select>
                <input
                  name="score"
                  value={formData.score}
                  onChange={handleChange}
                  type="number"
                  placeholder="Score"
                  className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
                />
                <input
                  name="lastContact"
                  value={formData.lastContact}
                  onChange={handleChange}
                  placeholder="Last Contact (e.g. Yesterday)"
                  className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
              >
                Submit Lead
              </button>
            </form>
          )}

          {/* Search and filters */}
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <input
              type="text"
              placeholder="Search leads..."
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex gap-4">
              <select className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600">
                <option>All Statuses</option>
                <option>New</option>
                <option>Offer Sent</option>
                <option>Under Contract</option>
                <option>Closed</option>
              </select>
              <select className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600">
                <option>All Scores</option>
                <option>60+</option>
                <option>70+</option>
                <option>80+</option>
                <option>90+</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#111827] rounded-lg overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-400 uppercase bg-[#1e293b]">
                <tr>
                  <th className="p-3">Name</th>
                  <th>Property</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Sniper Score</th>
                  <th>Last Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-700 hover:bg-[#2d3748]"
                  >
                    <td className="p-3">
                      <div className="font-semibold">{lead.name}</div>
                      <div className="text-gray-400 text-xs">{lead.email}</div>
                    </td>
                    <td>{lead.property}</td>
                    <td>{lead.location}</td>
                    <td>
                      <span className="bg-gray-700 text-xs px-2 py-1 rounded">
                        {lead.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span>{lead.score}</span>
                        <div className="w-24 h-2 bg-gray-700 rounded">
                          <div
                            className="h-2 rounded bg-green-500"
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>{lead.lastContact}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="text-yellow-400">✏️</button>
                        <button className="text-red-400">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-400">
                      No leads yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
