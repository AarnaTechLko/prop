'use client';

import {
  flexRender,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { useState, useRef, useEffect } from 'react';
import Sidebar from '../dashboard/components/Sidebar';
import Topbar from '../dashboard/components/Topbar';
import { Users, Pencil, Trash2, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useRouter } from "next/navigation";

interface LeadList {
  id: string;
  name: string;
  status?: number;
  createdAt?: string;
  leadCount?: number;
}

interface Lead {
  markettype: string;
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
  phone4_type: string;
  phone5: string;
  phone5_type: string;
  email1: string;
  email2: string;
  email3: string;
  email4: string;
  email5: string;
  social_network1: string;
  social_network2: string;
  social_handle1: string;
  social_handle2: string;
  apn: string;
  vacant: string;
  absentee: string;
  occupancy: string;
  ownership_type: string;
  formatted_apn: string;
  census_tract: string;
  subdivision: string;
  tract_number: string;
  company_flag: string;
  owner_type: string;
  primary_owner_first: string;
  primary_owner_middle: string;
  primary_owner_last: string;
  secondary_owner_first: string;
  secondary_owner_middle: string;
  secondary_owner_last: string;
  assessor_last_sale_date: string;
  assessor_prior_sale_date: string;
  assessor_prior_sale_amount: string;
  area_building: string;
  living_sqft: string;
  area_lot_acres: string;
  area_lot_sf: string;
  parking_garage: string;
  pool: string;
  bath_count: string;
  bedrooms_count: string;
  stories_count: string;
  energy: string;
  fuel: string;
  score: string;
  status: string;
  estimated_value: number;
  estimated_min_value: number;
  estimated_min_valueestimated_min_value: string;

}

export default function LeadListsPage() {
  const [leadLists, setLeadLists] = useState<LeadList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [updateShowModal, setUpdateShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [scoreFilter, setScoreFilter] = useState("");
  const [statusFilter,] = useState('');
  const [modalStatusLeadId, setModalStatusLeadId] = useState<number | null>(null);
  const [modalStatusValue, setModalStatusValue] = useState("");
  const [selectedLeadType, setSelectedLeadType] = useState('');


  const filteredLeadLists = leadLists.filter((list) =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
    console.log('Logged-in User ID:', storedUserId);
  }, []);

  useEffect(() => {
    fetchLeadLists();
  }, []);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const fetchLeadLists = async () => {
    try {
      setLoading(true);

      // Get user ID from localStorage (client-side only)
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }

      const res = await fetch('/api/leadtype', {
        method: 'GET',
        headers: {
          'x-user-id': userId,
        },
      });

      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        setLeadLists(result.data);
      } else {
        console.warn('Unexpected API response:', result);
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
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId!.toString() },
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
    fileInputRef.current?.click(); // trigger hidden file input
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData(); // ✅ this is the correct usage
    formData.append("file", file); // 'file' must match your API field

    try {
      const res = await fetch("/api/upload-csv", {
        method: "POST",
        body: formData,
        headers: {
          "x-user-id": localStorage.getItem("userId") || "", // or token if needed
        },
      });


      const result = await res.json();
      if (result.success) {
        await Swal.fire("Success", "CSV uploaded successfully!", "success");
        router.push("/leaddashboard");
      } else {
        await Swal.fire("Error", result.message || "Upload failed", "error");
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
      await Swal.fire("Error", "Something went wrong during upload.", "error");
    }
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
  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
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
        console.log('status data:', json);
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

  const openSwitchModal = (lead: Lead) => {
    setSelectedLead(lead);
    setSelectedLeadType(String(lead.leadtype)); // prefill current leadtype if needed
    setUpdateShowModal(true);
  };


  const handleUpdateList = async () => {
    if (!selectedLead || !selectedLeadType) {
      alert("Please select a lead and a list.");
      return;
    }

    try {
      const res = await fetch('/api/leadlist/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId: selectedLead.id,
          leadtype: selectedLeadType,
        }),
      });

      const result = await res.json();

      if (result.success) {
        // Store message in sessionStorage
        sessionStorage.setItem('lead-update-success', 'Lead type updated successfully');

        // Reload the page
        window.location.reload();
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Failed to update lead type:', error);
    }
  };
  useEffect(() => {
    const successMessage = sessionStorage.getItem('lead-update-success');
    if (successMessage) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: successMessage,
      });
      sessionStorage.removeItem('lead-update-success');
    }
  }, []);

  const columns: ColumnDef<Lead>[] = [
    {
      header: "Owner Details",
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="space-y-0.5 leading-tight">
            <div className="font-medium">{d.first_name} {d.last_name}</div>
            <div>{d.street_address}, {d.city}, {d.state} {d.zip_code}</div>
            <div>{d.mailing_street_address}, {d.mailing_city}, {d.mailing_state}</div>
            <div>📞 {d.phone1}</div>
            <div>✉️ {d.email1}</div>
          </div>
        );
      },
    },
    {
      header: "Property Type",
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="space-y-0.5 leading-tight">
            <div><strong>Occupancy:</strong> {d.occupancy}</div>
            <div><strong>Ownership:</strong> {d.ownership_type}</div>
            <div><strong>APN:</strong> {d.formatted_apn}</div>
            <div><strong>Census Tract:</strong> {d.census_tract}</div>
            <div><strong>Subdivision:</strong> {d.subdivision}</div>
            <div><strong>Tract #:</strong> {d.tract_number}</div>
            <div><strong>Primary Owner:</strong> {d.primary_owner_first} {d.primary_owner_middle}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "apn",
      header: "APN",
    },
    {
      accessorKey: "score",
      header: "Score",
      filterFn: (row, columnId, filterValue) => {
        const scoreValue = String(row.getValue(columnId) || "").toLowerCase();
        return scoreValue.includes(String(filterValue).toLowerCase());
      },
    },
    {
      accessorKey: "markettype", // corrected from markettype
      header: "MarketType",
    },

    // ✅ New Status Column
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const leadId = row.original.id;
        const status: keyof typeof statusColor = (row.original.status || "pending") as keyof typeof statusColor;

        const statusColor = {
          active: "bg-green-100 text-green-800",
          hold: "bg-yellow-100 text-yellow-800",
          process: "bg-blue-100 text-blue-800",
          customer: "bg-purple-100 text-purple-800",
          pending: "bg-gray-100 text-gray-600",
        };

        const badgeColor = statusColor[status];

        return (
          <button
            onClick={() => {
              setModalStatusLeadId(leadId);
              setModalStatusValue(status);
            }}
            className={`text-xs px-2 py-0.5 border border-gray-300 rounded hover:opacity-90 ${badgeColor}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        );
      },
    },

    {
      header: 'Switch List',
      id: 'switchList',
      cell: ({ row }) => (
        <button
          onClick={() => openSwitchModal(row.original)}
          className="text-blue-500 hover:text-blue-700 text-xs underline"
        >
          <span
            className="inline-block px-2 py-0.5 text-[10px] bg-blue-400 text-white rounded border border-gray-300"
          >
            Switch Lead
          </span>
        </button>
      ),
    },
    {
      header: "Action",
      id: "action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {/* View */}
          <button
            onClick={() => handleViewLead(row.original)}
            className="text-orange-500 hover:text-orange-600"
            title="View Lead"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Edit */}
          <button
            onClick={() => router.push(`/leadlist/edit/${row.original.id}`)}
            className="text-blue-500 hover:text-blue-600"
            title="Edit Lead"
          >
            <Pencil className="w-3 h-3" />
          </button>

          {/* Delete */}
          <button
            onClick={() => handleDeleteLead(row.original.id)}
            className="text-red-500 hover:text-red-600"
            title="Delete Lead"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },

  ];

  const handleDeleteLead = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This lead will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/leads/${id}`, {
          method: 'DELETE',
        });

        const result = await res.json(); // ✅ Parse JSON response

        if (res.ok) {
          Swal.fire('Deleted!', result.message || 'The lead has been deleted.', 'success');

          // Optionally refresh state or reload
          window.location.reload();

          // ✅ OR update state directly:
          // setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
        } else {
          Swal.fire('Error', result.message || 'Failed to delete the lead.', 'error');
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Something went wrong.', 'error');
      }
    }
  };


  // ✅ Create table instance with global filter
  const table = useReactTable({
    data: filteredLeads.length ? filteredLeads : leads,
    columns,
    state: {
      globalFilter,
    },
    globalFilterFn: (row, _columnId, filterValue) => {
      const d = row.original;

      const searchable = [
        d.first_name,
        d.last_name,
        d.email1,
        d.email2,
        d.email3,
        d.email4,
        d.email5,
        d.phone1,
        d.apn,
        d.occupancy,
        d.markettype,
        d.city,
        d.state,

      ]
        .filter(Boolean)
        .map(String)
        .join(" ")
        .toLowerCase();

      return searchable.includes(String(filterValue).toLowerCase());
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleSearchAndSubmit = () => {
    const trimmedScore = scoreFilter.trim().toLowerCase();

    if (!trimmedScore) {
      setFilteredLeads([]); // Show all
      return;
    }

    const filtered = leads.filter((lead) => {
      return String(lead.score || "").toLowerCase().includes(trimmedScore);
    });

    setFilteredLeads(filtered);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  useEffect(() => {
    const trimmedScore = scoreFilter.trim().toLowerCase();

    if (!trimmedScore) {
      setFilteredLeads(leads); // reset to all leads if input is cleared
      return;
    }

    const filtered = leads.filter((lead) =>
      String(lead.score || "").toLowerCase().includes(trimmedScore)
    );

    setFilteredLeads(filtered);
  }, [scoreFilter, leads]);

  useEffect(() => {
    const filtered = leads.filter((lead) => {
      const matchesGlobal = globalFilter.trim()
        ? (
          `${lead.first_name} ${lead.last_name} ${lead.email1} ${lead.apn} ${lead.occupancy} ${lead.markettype}`
        )
          .toLowerCase()
          .includes(globalFilter.trim().toLowerCase())
        : true;

      const matchesStatus = statusFilter
        ? String(lead.status || '').toLowerCase() === statusFilter.toLowerCase()
        : true;

      return matchesGlobal && matchesStatus;
    });

    setFilteredLeads(filtered);
  }, [globalFilter, statusFilter, leads]);


  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads", {
        headers: {
          "x-user-id": localStorage.getItem("userId") || "",
        },
      });
      const json = await res.json();

      if (json.success) {
        setLeads(json.data); // set your frontend state
      } else {
        console.error("Failed to fetch leads:", json.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);


  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        {loading ? (
          <div className="text-center py-10 text-gray-600 text-sm">Loading...</div>
        ) : (
          <>
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

              <aside className="w-60 bg-white border border-gray-300 rounded p-6 overflow-y-auto flex flex-col">
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
                        className={`mb-4 cursor-pointer rounded-lg p-4 shadow-sm transition-shadow border text-sm flex justify-between items-center
                            ${selectedListId === list.id
                            ? 'border-2 border-blue-500 bg-blue-300 text-blue-900 shadow-md'
                            : 'border border-gray-300 hover:shadow-lg hover:bg-blue-50'}
                                             `}
                        onClick={() => setSelectedListId(list.id)}
                      >
                        <div>

                          <div className="font-semibold text-gray-800">{list.name}</div>
                          <div className="text-xs text-gray-500">{list.leadCount || 0} leads</div>
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
              <main className="flex-1 p-1 overflow-auto border border-gray-300 rounded ml-4 bg-white">
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
                        className="px-4 py-2 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
                      >
                        + New List
                      </button>
                    </div>
                    {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
                  </div>
                ) : (
                  <div className="p-1 text-[11px]"> {/* Reduced font size */}

                    <div className="overflow-x-auto rounded border border-gray-200">


                      <div className="flex flex-wrap justify-between items-center gap-3 mb-3 pt-3 mx-3">
                        <input
                          type="text"
                          value={globalFilter}
                          onChange={(e) => setGlobalFilter(e.target.value)}
                          placeholder="Search leads..."
                          className="px-3 py-1 text-sm border rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={scoreFilter}
                            onChange={(e) => setScoreFilter(e.target.value)}
                            placeholder="Search by score..."
                            className="px-3 py-1 text-sm border rounded w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                          />

                          <button
                            onClick={handleSearchAndSubmit}
                            className="px-4 py-1.5 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                          >
                            Search
                          </button>

                          {/*  <button
                            onClick={handleSearchAndSubmit}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                          >
                            Submit
                          </button> */}
                        </div>
                      </div>

                      {modalStatusLeadId && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
                          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 space-y-5">
                            <h2 className="text-lg font-semibold text-gray-800">Update Lead Status</h2>

                            <select
                              value={modalStatusValue}
                              onChange={(e) => setModalStatusValue(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="active">Active</option>
                              <option value="hold">Hold</option>
                              <option value="process">Process</option>
                              <option value="customer">Customer</option>
                            </select>

                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => setModalStatusLeadId(null)}
                                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg--red-500 transition"
                              >
                                Cancel
                              </button>

                              <button
                                onClick={async () => {
                                  try {
                                    const res = await fetch("/api/update-lead-status", {
                                      method: "PUT",
                                      headers: {
                                        "Content-Type": "application/json",
                                        "x-user-id": localStorage.getItem("userId") || "",
                                      },
                                      body: JSON.stringify({
                                        leadId: modalStatusLeadId,
                                        status: modalStatusValue,
                                      }),
                                    });

                                    const json = await res.json();
                                    if (json.success) {
                                      setLeads((prev) =>
                                        prev.map((lead) =>
                                          lead.id === modalStatusLeadId
                                            ? { ...lead, status: modalStatusValue }
                                            : lead
                                        )
                                      );
                                    } else {
                                      console.error("Status update failed:", json.message);
                                    }
                                  } catch (err) {
                                    console.error("Status update error:", err);
                                  }

                                  setModalStatusLeadId(null);
                                }}
                                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      )}



                      <table className="min-w-full text-[11px] table-auto border border-gray-300 rounded">
                        <thead className="bg-gray-100 text-gray-700">
                          {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                              {headerGroup.headers.map(header => (
                                <th
                                  key={header.id}
                                  colSpan={header.colSpan}
                                  className="bg-gray-500 text-white px-2 py-1 border border-gray-200 text-left font-bold text-[11px] uppercase"
                                >
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                              ))}
                            </tr>
                          ))}
                        </thead>
                        <tbody>
                          {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                              <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map(cell => (
                                  <td
                                    key={cell.id}
                                    className="px-2 py-1 border border-gray-200 text-[12px] text-gray-500"
                                  >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={columns.length} className="p-3 text-center text-gray-500 font-bold">
                                No leads found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>


                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-3 text-[10px]">
                      <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span>
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                      </span>
                      <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>

                )}


                {isModalOpen && selectedLead && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
                    <div className="bg-white p-6 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-lg">
                      <h2 className="text-lg text-center font-semibold mb-4">Lead Details</h2>

                      {/* Owner Details Section */}
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Owner Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500 mb-6">
                        <div><strong>First Name:</strong> {selectedLead.first_name}</div>
                        <div><strong>Last Name:</strong> {selectedLead.last_name}</div>
                        <div><strong>Phone 1:</strong> {selectedLead.phone1}</div>
                        <div><strong>Phone 1 Type:</strong> {selectedLead.phone1_type}</div>
                        <div><strong>Phone 2:</strong> {selectedLead.phone2}</div>
                        <div><strong>Phone 2 Type:</strong> {selectedLead.phone2_type}</div>
                        <div><strong>Phone 3:</strong> {selectedLead.phone3}</div>
                        <div><strong>Phone 3 Type:</strong> {selectedLead.phone3_type}</div>
                        <div><strong>Phone 4:</strong> {selectedLead.phone4}</div>
                        <div><strong>Phone 4 Type:</strong> {selectedLead.phone4_type}</div>
                        <div><strong>Phone 5:</strong> {selectedLead.phone5}</div>
                        <div><strong>Phone 5 Type:</strong> {selectedLead.phone5_type}</div>
                        <div><strong>Email 1:</strong> {selectedLead.email1 || "N/A"}</div>
                        <div><strong>Email 2:</strong> {selectedLead.email2 || "N/A"}</div>
                        <div><strong>Email 3:</strong> {selectedLead.email3 || "N/A"}</div>
                        <div><strong>Email 4:</strong> {selectedLead.email4 || "N/A"}</div>
                        <div><strong>Email 5:</strong> {selectedLead.email5 || "N/A"}</div>
                      </div>

                      {/* Property Details Section */}
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Property Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500 mb-6">
                        <div><strong>Vacant:</strong> {selectedLead.vacant}</div>
                        <div><strong>Absentee:</strong> {selectedLead.absentee}</div>
                        <div><strong>Occupancy:</strong> {selectedLead.occupancy}</div>
                        <div><strong>Ownership Type:</strong> {selectedLead.ownership_type}</div>
                        <div><strong>Census Tract:</strong> {selectedLead.census_tract}</div>
                        <div><strong>Subdivision:</strong> {selectedLead.subdivision}</div>
                        <div><strong>Tract Number:</strong> {selectedLead.tract_number}</div>
                        <div><strong>Company Flag:</strong> {selectedLead.company_flag}</div>
                        <div><strong>Owner Type:</strong> {selectedLead.owner_type}</div>
                        <div><strong>Primary Owner:</strong> {selectedLead.primary_owner_first} {selectedLead.primary_owner_middle} {selectedLead.primary_owner_last}</div>
                        <div><strong>Secondary Owner:</strong> {selectedLead.secondary_owner_first} {selectedLead.secondary_owner_middle} {selectedLead.secondary_owner_last}</div>
                        <div><strong>Last Sale Date:</strong> {selectedLead.assessor_last_sale_date}</div>
                        <div><strong>Prior Sale Date:</strong> {selectedLead.assessor_prior_sale_date}</div>
                        <div><strong>Prior Sale Amount:</strong> {selectedLead.assessor_prior_sale_amount}</div>
                        <div><strong>Building Area:</strong> {selectedLead.area_building}</div>
                        <div><strong>Living Sqft:</strong> {selectedLead.living_sqft}</div>
                        <div><strong>Lot Area Acres:</strong> {selectedLead.area_lot_acres}</div>
                        <div><strong>Lot Area Sqft:</strong> {selectedLead.area_lot_sf}</div>
                        <div><strong>Garage:</strong> {selectedLead.parking_garage}</div>
                        <div><strong>Pool:</strong> {selectedLead.pool}</div>
                        <div><strong>Bathrooms:</strong> {selectedLead.bath_count}</div>
                        <div><strong>Bedrooms:</strong> {selectedLead.bedrooms_count}</div>
                        <div><strong>Stories:</strong> {selectedLead.stories_count}</div>
                        <div><strong>Energy:</strong> {selectedLead.energy}</div>
                        <div><strong>Fuel:</strong> {selectedLead.fuel}</div>
                        <div><strong>Estimated Value:</strong> {selectedLead.estimated_value}</div>
                        <div><strong>Min Value:</strong> {selectedLead.estimated_min_value}</div>
                        <div><strong>Max Value:</strong> {selectedLead.estimated_value}</div>
                        <div><strong>Score:</strong> {selectedLead.score}</div>
                      </div>

                      {/* Lead Summary Section */}
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Lead Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500 mb-6">
                        <div><strong>Social Network 1:</strong> {selectedLead.social_network1}</div>
                        <div><strong>Social Handle 1:</strong> {selectedLead.social_handle1}</div>
                        <div><strong>Social Network 2:</strong> {selectedLead.social_network2}</div>
                        <div><strong>Social Handle 2:</strong> {selectedLead.social_handle2}</div>
                        <div><strong>APN:</strong> {selectedLead.apn}</div>
                        <div><strong>Lead Type:</strong> {selectedLead.leadtype}</div>
                        <div><strong>Market Type:</strong> {selectedLead.markettype}</div>
                        <div><strong>Status:</strong> {selectedLead.status}</div>
                      </div>

                      <div className="mt-6 text-right">
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}


              </main>

            </div>
          </>)}
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

      {/* Modal for Switch list */}
      {updateShowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Switch Lead to Another List
            </h2>

            <label className="block text-sm text-gray-600 mb-2 font-medium">
              Select List
            </label>
            <select
              value={selectedLeadType}
              onChange={(e) => setSelectedLeadType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            >
              <option value="">-- Select Lead Type --</option>
              {filteredLeadLists.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setUpdateShowModal(false);
                  setSelectedLead(null);
                  setSelectedLeadType('');
                }}
                className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateList}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}