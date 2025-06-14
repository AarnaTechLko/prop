'use client';

import { useState, useRef, useEffect } from 'react';
import Sidebar from '../dashboard/components/Sidebar';
import Topbar from '../dashboard/components/Topbar';
import { Users } from 'lucide-react';

interface LeadList {
  id: string;
  name: string;
  leadsCount: number;
}

export default function LeadListsPage() {
  const [leadLists, setLeadLists] = useState<LeadList[]>([
    { id: '1', name: 'Propwire Export - 28 Properties - Jun 11, 2025', leadsCount: 27 },
    { id: '2', name: 'Primary Leads', leadsCount: 2 },
    { id: '3', name: 'Cold Leads', leadsCount: 1 },
  ]);

  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setMessage(`Selected file: ${file.name}`);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;

    try {
      const res = await fetch('/api/leadtype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName, status: 1 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create lead list');

      const newList: LeadList = {
        id: Date.now().toString(),
        name: newListName,
        leadsCount: 0,
      };

      setLeadLists([...leadLists, newList]);
      setMessage('New lead list created successfully!');
      setShowModal(false);
      setNewListName('');
    } catch (err) {
      console.error('Error:', err);
      setMessage('Failed to create new lead list');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="flex items-center justify-between px-8 mt-6">
          <div>
            <h1 className="font-bold text-lg">Lead Lists</h1>
            <p className="text-sm text-gray-600">
              Manage your imported lead lists and access all imported lists
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleImportClick}
              className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
            >
              <Users size={16} className="text-gray-700" />
              Import Lead
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1 bg-orange-400 text-white rounded text-sm hover:bg-orange-600"
            >
              + New List
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden mt-6 mx-4 mb-4">
          {/* Left Panel */}
          <aside className="w-80 bg-white border border-gray-300 rounded p-6 overflow-y-auto flex flex-col">
            <h3 className="text-black font-bold mb-4">Lead Lists</h3>
            <input
              type="search"
              placeholder="Search lists..."
              className="w-full p-2 mb-4 border rounded text-sm"
            />
            <ul>
              {leadLists.map((list) => (
                <li
                  key={list.id}
                  onClick={() => setSelectedListId(list.id)}
                  className={`mb-4 cursor-pointer rounded-lg p-4 shadow-sm transition-shadow border text-sm ${
                    selectedListId === list.id
                      ? 'border-2 border-blue-500 bg-gray-50 shadow-md'
                      : 'border border-gray-300 hover:shadow-lg hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold text-gray-800">{list.name}</div>
                  <div className="text-xs text-gray-500">{list.leadsCount} leads</div>
                </li>
              ))}
            </ul>
          </aside>

          {/* Right Panel */}
          <main className="flex-1 p-8 overflow-auto border border-gray-300 rounded ml-4 bg-white">
            {!selectedListId ? (
              <div className="flex flex-col items-center justify-center text-center text-gray-700 max-w-xl mx-auto mt-40">
                <h2 className="mb-2 text-xl font-semibold">Select a Lead List</h2>
                <p className="mb-6 text-sm text-gray-500">
                  Choose a lead list from the sidebar to view and manage its leads,
                  <br />
                  or import new leads to create a list.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleImportClick}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-sm text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  >
                    <Users size={16} className="text-gray-700" />
                    Import Leads
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
                  >
                    + New List
                  </button>
                </div>
                {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {leadLists.find((l) => l.id === selectedListId)?.name}
                </h2>
                <p className="text-sm text-gray-600">Leads management interface coming soon...</p>
                <button
                  onClick={() => setSelectedListId(null)}
                  className="mt-6 text-blue-600 hover:underline text-sm"
                >
                  &larr; Back to lists
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Modal with blur background */}
      {showModal && (
<div className="fixed inset-0 z-50   flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Create New Lead List</h2>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Enter list name"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewListName('');
                }}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateList}
                className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
