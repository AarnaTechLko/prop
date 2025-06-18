'use client';

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { useState, useRef, useEffect, useMemo } from 'react';
import Sidebar from '../dashboard/components/Sidebar';
import Topbar from '../dashboard/components/Topbar';
import { Users, Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


interface LeadList {
  id: string;
  name: string;
  status?: number;
  createdAt?: string;
  leadsCount?: number;
}

interface Lead {
  id: number;
  user_id: number;
  leadtype: string; // <--- ADD THIS LINE
  first_name: string;
  last_name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  mailing_street_address: string;
  mailing_city: string;
  mailing_state: string;
  phone1: string;
  phone1_type: string;
  phone2: string;
  phone2_type: string;
  phone3: string;
  phone3_type: string;
  phone4: string;
}

export default function LeadListsPage() {
  const [leadLists, setLeadLists] = useState<LeadList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);

  const [userId, setUserId] = useState<string | null>(null);

  const filteredLeadLists = leadLists.filter((list) =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
    console.log('Logged-in User ID:', storedUserId);
  }, []);

  useEffect(() => {
    const fetchLeadCounts = async () => {
      try {
        const res = await fetch('/api/list', {
          headers: { 'x-user-id': userId!.toString() },
        });

        const json = await res.json();
        if (json.success) {
          const countMap = new Map<string, number>();
          json.data.forEach((entry: { leadtype: string; count: number }) => {
            countMap.set(entry.leadtype, entry.count);
          });

          setLeadLists((prevLists) =>
            prevLists.map((list) => ({
              ...list,
              leadsCount: countMap.get(list.id) || 0,
            }))
          );
        } else {
          console.error('API Error:', json.message);
        }
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    };

    if (userId) fetchLeadCounts();
  }, [userId]);


  useEffect(() => {
    fetchLeadLists();
  }, []);

  // useEffect(() => {
  //   fetchLead();
  // }, [id, userId]);


  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const fetchLeadLists = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leadtype');
      const data = await res.json();
      if (Array.isArray(data)) {
        setLeadLists(data);
      } else {
        console.warn('Unexpected API response:', data);
        setLeadLists([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Swal.fire('Error', 'Failed to load lead lists.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      Swal.fire('Validation', 'List name is required', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/leadtype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName, status: 1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create list');
      }

      fetchLeadLists();
      Swal.fire('Success', 'List created successfully!', 'success');
      setShowModal(false);
      setNewListName('');
    } catch (error: unknown) {
      console.error('Creation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create list';
      Swal.fire('Error', errorMessage, 'error');
    }

  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) Swal.fire('File Selected', file.name, 'info');
  };

  const selectedList = leadLists.find((list) => list.id === selectedListId);

  const handleEdit = async (list: LeadList) => {
    const { value: newName } = await Swal.fire({
      title: 'Edit Lead List Name',
      input: 'text',
      inputLabel: 'New name',
      inputValue: list.name,
      showCancelButton: true,
      confirmButtonText: 'Update',
      inputValidator: (value) => {
        if (!value.trim()) return 'Name is required';
        if (value.trim() === list.name) return 'Name must be different';
      },
    }); if (!newName || newName.trim() === '' || newName === list.name) return;

    try {
      const response = await fetch(`/api/leadtype/${list.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (response.ok) {
        const updatedLists = leadLists.map((l) =>
          l.id === list.id ? { ...l, name: newName.trim() } : l
        );
        setLeadLists(updatedLists);
        Swal.fire('Success', 'Lead list updated!', 'success');
      } else {
        Swal.fire('Error', 'Failed to update lead list.', 'error');
      }
    } catch (error) {
      console.error('Edit error:', error);
      Swal.fire('Error', 'An error occurred while updating.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = await Swal.fire({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to delete this lead list?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      const response = await fetch(`/api/leadtype/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedLists = leadLists.filter((list) => list.id !== id);
        setLeadLists(updatedLists);
        if (selectedListId === id) setSelectedListId(null);
        Swal.fire('Deleted!', 'Lead list has been deleted.', 'success');
      } else {
        Swal.fire('Error', 'Failed to delete lead list.', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      Swal.fire('Error', 'An error occurred while deleting.', 'error');
    }
  };

  useEffect(() => {
    const fetchLeadsByList = async () => {
      if (!selectedListId || !userId) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/list/${selectedListId}`, {
          headers: {
            'x-user-id': String(userId),
          },
        });

        const json = await res.json();
        if (json.success) {
          setLeads(json.data); // show in table
        } else {
          console.error('API Error:', json.message);
        }
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadsByList();
  }, [selectedListId, userId]);


  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        header: 'First Name',
        accessorKey: 'first_name',
      },
      {
        header: 'Last Name',
        accessorKey: 'last_name',
      },
      {
        header: 'City',
        accessorKey: 'city',
      },
      {
        header: 'Phone',
        accessorKey: 'phone1',
      },
      {
        header: 'Type',
        accessorKey: 'phone1_type',
      },
     
    ],
    []
  );

  const table = useReactTable({
    data: leads,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });



  if (loading) return <p>Loading lead details...</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        {/* Page Header */}
        <div className="flex items-center justify-between px-8 mt-6">
          <div>
            <h1 className="font-bold text-lg">Lead Lists</h1>
            <p className="text-sm text-gray-600">Manage your imported lead lists</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleImportClick}
              className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
            >
              <Users size={16} />
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

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden mt-6 mx-4 mb-4">
          {/* Sidebar Lead Lists */}

          <aside className="w-80 bg-white border border-gray-300 rounded p-6 overflow-y-auto flex flex-col">
            <h3 className="text-black font-bold mb-4">Lead Lists</h3>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search lists..."
              className="w-full p-2 mb-4 border rounded text-sm"
            />

            <ul>
              {loading ? (
                <li className="text-gray-500 text-sm">Loading...</li>
              ) : filteredLeadLists.length === 0 ? (
                <li className="text-gray-500 text-sm">No lead lists found.</li>
              ) : (
                filteredLeadLists.map((list) => (
                  <li
                    key={list.id}
                    className={`mb-4 cursor-pointer rounded-lg p-4 shadow-sm transition-shadow border text-sm flex justify-between items-center ${selectedListId === list.id
                      ? 'border-2 border-blue-500 bg-gray-50 shadow-md'
                      : 'border border-gray-300 hover:shadow-lg hover:bg-gray-50'
                      }`}
                    onClick={() => setSelectedListId(list.id)}
                  >
                    <div>

                      <div className="font-semibold text-gray-800">{list.name}</div>
                      <div className="text-xs text-gray-500">{list.leadsCount || 0} leads</div>
                    </div>

                    <div className="flex space-x-2 ml-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleEdit(list)} className="text-gray-500 hover:text-blue-600">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(list.id)} className="text-gray-500 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </aside>


          {/* Right-side Panel */}
          <main className="flex-1 p-8 overflow-auto border border-gray-300 rounded ml-4 bg-white">
            {!selectedList ? (
              <div className="flex flex-col items-center justify-center text-center text-gray-700 max-w-xl mx-auto mt-40">
                <h2 className="mb-2 text-xl font-semibold">Select a Lead List</h2>
                <p className="mb-6 text-sm text-gray-500">
                  Choose a lead list from the sidebar to view and manage its leads.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleImportClick}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-sm text-gray-800 rounded hover:bg-gray-300"
                  >
                    <Users size={16} />
                    Import Leads
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
                  >
                    + New List
                  </button>
                </div>
                {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold">{selectedList.name}</h2>
                <h2 className="text-xl font-bold">{selectedList.id}</h2>
                <div className="mt-6 overflow-x-auto">


                  <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full border border-gray-200 text-sm">
                      <thead className="bg-gray-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <th key={header.id} className="p-2 border text-left font-semibold">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody>
                        {table.getRowModel().rows.length > 0 ? (
                          table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="text-center">
                              {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="p-2 border">
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-4 border text-center text-gray-500">
                              Lead data not found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-sm">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                      </span>
                      <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            )}
          </main>
        </div>
      </div>

      {/* Hidden CSV Upload */}
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />


      
      {/* Modal for Creating New List */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
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
