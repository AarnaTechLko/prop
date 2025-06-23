'use client';

import { useState, useRef, useEffect } from 'react';
import { FileImage } from 'lucide-react';
import Swal from 'sweetalert2';
import Sidebar from '../dashboard/components/Sidebar';
import Topbar from '../dashboard/components/Topbar';
import DataTable from 'react-data-table-component';
import { useRouter } from "next/navigation";
interface LeadType {
  id: string;
  name: string;
  created_at: string | Date;
}


interface Lead {
  id: string;
  phone1?: string;
  score: number;
  [key: string]: unknown;
  first_name?: string;
  last_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  mailing_street_address?: string;
  mailing_city?: string;
  mailing_state?: string;
  phone1_type?: string;
  phone2?: string;
  phone2_type?: string;
  phone3?: string;
  phone3_type?: string;
  phone4?: string;
  phone4_type?: string;
  phone5?: string;
  phone5_type?: string;
  email1?: string;
  email2?: string;
  email3?: string;
  email4?: string;
  email5?: string;
  social_network1?: string;
  social_handle1?: string;
  social_network2?: string;
  social_handle2?: string;
  apn?: string;
  vacant?: string;
  absentee?: string;
  occupancy?: string;
  ownership_type?: string;
  formatted_apn?: string;
  census_tract?: string;
  subdivision?: string;
  tract_number?: string;
  company_flag?: string;
  owner_type?: string;
  primary_owner_first?: string;
  primary_owner_middle?: string;
  primary_owner_last?: string;
  secondary_owner_first?: string;
  secondary_owner_middle?: string;
  secondary_owner_last?: string;
  assessor_last_sale_date?: string;
  assessor_last_sale_amount?: string;
  assessor_prior_sale_date?: string;
  assessor_prior_sale_amount?: string;
  area_building?: string;
  living_sqft?: string;
  area_lot_acres?: string;
  area_lot_sf?: string;
  parking_garage?: string;
  pool?: string;
  bath_count?: string;
  bedrooms_count?: string;
  stories_count?: string;
  energy?: string;
  fuel?: string;
  estimated_value?: string;
  estimated_min_value?: string;
  estimated_max_value?: string;
  leadtype?: string;
  markettype?: string;
}

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState<'uploadLeads' | 'scoreFilter' | 'createLists' | 'market'>('uploadLeads');
  const [minScore, setMinScore] = useState(0);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [message,] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedList, setSelectedList] = useState("");
  const [leadstypes, setLeadstypes] = useState([]);
  const [, setError] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [minScoreThreshold, setMinScoreThreshold] = useState<number>(0);

  // ✅ Add these states for tab control
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [scoreFilterEnabled, setScoreFilterEnabled] = useState(false);
  const [createListsEnabled, setCreateListsEnabled] = useState(false);


  type TabKey = 'uploadLeads' | 'scoreFilter' | 'createLists' | 'market';

  const labelMap: Partial<Record<TabKey, string>> = {
    uploadLeads: 'Upload Leads',
    ...(isUploadSuccessful && { scoreFilter: 'Score Filter' }),
    ...(scoreFilterEnabled && { createLists: 'Create Lists' }),
    ...(createListsEnabled && { market: 'Market' }),
  };


  const toggleSelectAll = () => {
    const allSelected = selectedLeads.length === leads.length;
    setSelectedLeads(allSelected ? [] : leads.map((lead) => lead.id));
  };

  const handleImportClick = async () => {
    if (!selectedFile) return;
    setIsLoading(true);

    Swal.fire({
      title: "Uploading...",
      text: "Please wait while we import your leads.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/upload-csv", {
        method: "POST",
        headers: {
          "x-user-id": localStorage.getItem("userId") || "",
        },
        body: formData,
      });

      const data = await res.json();
      Swal.close();

      if (data.success) {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Leads imported successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        setSelectedFile(null);
        setIsUploadSuccessful(true);
        setSelectedTab("scoreFilter");
      } else {
        await Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: data.message || "Failed to import leads.",
        });
      }
    } catch {
      Swal.close();
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong during upload.",
      });
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const savedTab = localStorage.getItem("selectedTab") as
      | "uploadLeads"
      | "scoreFilter"
      | "createLists"
      | "market"
      | null;

    if (savedTab && ["uploadLeads", "scoreFilter", "createLists", "market"].includes(savedTab)) {
      setSelectedTab(savedTab);
      localStorage.removeItem("selectedTab");
    }
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await fetch('/api/update-scores', {
        method: 'GET',
        headers: {
          'x-user-id': localStorage.getItem('userId') || ''
        }
      });
      const json = await res.json();
      setLeads(json.data);
    };

    fetchLeads();
  }, []);

  useEffect(() => {
    if (selectedTab === "market") {
      const storedLeads = sessionStorage.getItem("selectedLeads");
      const storedScore = sessionStorage.getItem("selectedMinScore");

      if (storedLeads) {
        setSelectedLeads(JSON.parse(storedLeads));
      }

      if (storedScore) {
        setMinScoreThreshold(Number(storedScore)); // assuming setMinScoreThreshold updates state
      }
    }
  }, [selectedTab]);


  const handleContinueMarketing = async () => {
    // Validate fields before setting loading state
    if (!selectedList || !selectedChannel) {
      Swal.fire("Missing info", "Select both list and marketing channel", "warning");
      return;
    }
    console.log("🟡 Submitting leads with list:", selectedList, "and channel:", selectedChannel);
    const storedScore = sessionStorage.getItem("selectedMinScore");
    const userId = localStorage.getItem("userId");
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Missing User ID",
        text: "User ID not found. Please log in again.",
      });
      return;
    }

    setLoading(true);
    setSelectedTab("market");

    const payload = leads
      .filter((lead) => selectedLeads.includes(lead.id))
      .map((lead) => ({
        user_id: Number(userId),
        first_name: lead.first_name || null,
        last_name: lead.last_name || null,
        street_address: lead.street_address || null,
        city: lead.city || null,
        state: lead.state || null,
        zip_code: lead.zip_code || null,
        mailing_street_address: lead.mailing_street_address || null,
        mailing_city: lead.mailing_city || null,
        mailing_state: lead.mailing_state || null,
        phone1: lead.phone1 || null,
        phone1_type: lead.phone1_type || null,
        phone2: lead.phone2 || null,
        phone2_type: lead.phone2_type || null,
        phone3: lead.phone3 || null,
        phone3_type: lead.phone3_type || null,
        phone4: lead.phone4 || null,
        phone4_type: lead.phone4_type || null,
        phone5: lead.phone5 || null,
        phone5_type: lead.phone5_type || null,
        email1: lead.email1 || null,
        email2: lead.email2 || null,
        email3: lead.email3 || null,
        email4: lead.email4 || null,
        email5: lead.email5 || null,
        social_network1: lead.social_network1 || null,
        social_handle1: lead.social_handle1 || null,
        social_network2: lead.social_network2 || null,
        social_handle2: lead.social_handle2 || null,
        apn: lead.apn || null,
        vacant: lead.vacant === "1" ? 1 : 0,
        absentee: lead.absentee === "1" ? 1 : 0,
        occupancy: lead.occupancy || null,
        ownership_type: lead.ownership_type || null,
        formatted_apn: lead.formatted_apn || null,
        census_tract: lead.census_tract || null,
        subdivision: lead.subdivision || null,
        tract_number: lead.tract_number || null,
        company_flag: lead.company_flag === "1" ? 1 : 0,
        owner_type: lead.owner_type || null,
        primary_owner_first: lead.primary_owner_first || null,
        primary_owner_middle: lead.primary_owner_middle || null,
        primary_owner_last: lead.primary_owner_last || null,
        secondary_owner_first: lead.secondary_owner_first || null,
        secondary_owner_middle: lead.secondary_owner_middle || null,
        secondary_owner_last: lead.secondary_owner_last || null,
        assessor_last_sale_date: lead.assessor_last_sale_date
          ? new Date(lead.assessor_last_sale_date)
          : null,
        assessor_last_sale_amount: lead.assessor_last_sale_amount
          ? parseFloat(lead.assessor_last_sale_amount)
          : null,
        assessor_prior_sale_date: lead.assessor_prior_sale_date
          ? new Date(lead.assessor_prior_sale_date)
          : null,
        assessor_prior_sale_amount: lead.assessor_prior_sale_amount
          ? parseFloat(lead.assessor_prior_sale_amount)
          : null,
        area_building: lead.area_building || null,
        living_sqft: lead.living_sqft ? parseInt(lead.living_sqft, 10) : null,
        area_lot_acres: lead.area_lot_acres ? parseFloat(lead.area_lot_acres) : null,
        area_lot_sf: lead.area_lot_sf ? parseInt(lead.area_lot_sf, 10) : null,
        parking_garage: lead.parking_garage || null,
        pool: lead.pool === "1" ? 1 : 0,
        bath_count: lead.bath_count ? parseFloat(lead.bath_count) : null,
        bedrooms_count: lead.bedrooms_count ? parseInt(lead.bedrooms_count, 10) : null,
        stories_count: lead.stories_count ? parseInt(lead.stories_count, 10) : null,
        energy: lead.energy || null,
        fuel: lead.fuel || null,
        score: storedScore,
        estimated_value: lead.estimated_value
          ? parseFloat(lead.estimated_value)
          : null,
        estimated_min_value: lead.estimated_min_value
          ? parseFloat(lead.estimated_min_value)
          : null,
        estimated_max_value: lead.estimated_max_value
          ? parseFloat(lead.estimated_max_value)
          : null,
        leadtype: Number(selectedList) || 0,
        markettype: selectedChannel || "",

      }));

    try {
      const response = await fetch("/api/save-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ leads: payload }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Leads Saved",
          text: `${payload.length} leads saved successfully.`,
        });

        // Clear session
        sessionStorage.removeItem("selectedLeads");
        sessionStorage.removeItem("selectedMinScore");

        // Redirect
        router.push("/leadlist");
      } else {
        console.error("❌ Failed to save leads:", result);
        Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: result.message || "Failed to save leads.",
        });
      }
    } catch (err) {
      console.error("🚨 Error saving leads:", err);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Something went wrong while saving leads.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScoreNext = () => {
    if (minScore <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Select Score",
        text: "Please choose a minimum score before proceeding.",
      });
      return;
    }

    sessionStorage.setItem("selectedMinScore", minScore.toString());
    setScoreFilterEnabled(true);
    setSelectedTab("createLists");
  };


  // ✅ Create Lists Next button
  const handleCreateListAndGoNext = async () => {
    if (selectedLeads.length === 0) {
      await Swal.fire({
        icon: "warning",
        title: "No Leads Selected",
        text: "Please select at least one lead before proceeding.",
      });
      return;
    }

    sessionStorage.setItem("selectedLeads", JSON.stringify(selectedLeads));
    sessionStorage.setItem("selectedMinScore", String(minScoreThreshold));
    setCreateListsEnabled(true);
    setSelectedTab("market");
  };


  const toggleLead = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  // const handleCreateListAndGoNext = () => {
  //   sessionStorage.setItem("selectedLeads", JSON.stringify(selectedLeads));
  //   sessionStorage.setItem("selectedMinScore", String(minScoreThreshold));
  //   setSelectedTab("market");
  // };

  useEffect(() => {
    if (selectedTab === "createLists") {
      const storedScore = sessionStorage.getItem("selectedMinScore");
      if (storedScore) {
        const parsedScore = parseInt(storedScore, 10);
        setMinScoreThreshold(parsedScore);
        console.log("session score", parsedScore);
      }
    }
  }, [selectedTab, leads]);

  const columns = [
    {
      name: 'Select',
      cell: (row: Lead) => (
        <input
          type="checkbox"
          checked={selectedLeads.includes(row.id)}
          onChange={() => toggleLead(row.id)}
        />
      ),
      width: '80px',
    },
    {
      name: 'Lead',
      selector: (row: Lead) => row.first_name?.trim() || '',
      sortable: true,
    },
    {
      name: 'Contact',
      selector: (row: Lead) => row.phone1?.trim() || '',
    },
    {
      name: 'Status',
      cell: () => (
        <span className="bg-orange-300 text-white px-2 py-1 text-xs rounded">
          pending
        </span>
      ),
    },
    {
      name: 'Score',
      cell: (row: Lead) => {
        const isQualified = typeof row.score === "number" && row.score >= minScoreThreshold;

        return (
          <span
            className={`px-2 py-1 text-xs rounded ${isQualified
              ? "bg-green-100 text-green-700 font-bold"
              : "bg-yellow-100 text-yellow-600"
              }`}
          >
            {sessionStorage.getItem("selectedMinScore")}
          </span>
        );
      },
    },
  ]


  useEffect(() => {
    const fetchLeadsTypes = async () => {
      try {
        setLoading(true);
        setError('');

        const userId = localStorage.getItem('userId');
        console.log("sjdgjs", userId);
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }

        const res = await fetch('/api/leadtype', {
          method: 'GET',
          headers: {
            'x-user-id': userId,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch lead types');
        }

        const json = await res.json();
        setLeadstypes(json.data || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'An error occurred');
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }

    };

    // ✅ Call only when client-side
    if (typeof window !== 'undefined') {
      fetchLeadsTypes();
    }
  }, []);




  return (
    <div className="flex h-screen bg-gray-100 overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-x-hidden">
        <Topbar />
        {loading && (
          <div className="fixed top-0 left-0 w-full h-full  flex items-center justify-center z-50">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}


        <main className="flex-1 p-6 bg-gray-100 min-h-screen overflow-y-auto relative">


          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-black">Lead Dashboard</h2>
            <div className="flex justify-end mb-4">
              <a
                href="/files/sample.csv"
                download="sample.csv"
                className="px-2 py-2 text-xs bg-yellow-400  rounded hover:bg-yellow-500"
              >
                Sample Download
              </a>
            </div>
            <p className="text-xs text-gray-600 mb-4">Import, score, and create lead lists for marketing</p>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 ms-20 bg-orange-50 rounded-lg">
              {(Object.keys(labelMap) as TabKey[]).map((tabKey) => (

                <button
                  key={tabKey}
                  onClick={() => setSelectedTab(tabKey)}
                  className={`px-6 py-2 rounded text-xs transition duration-300 ${selectedTab === tabKey
                    ? 'bg-yellow-500 text-black font-semibold shadow-md'
                    : 'bg-white text-gray-700 hover:bg-white hover:text-black hover:shadow'
                    }`}
                >
                  {labelMap[tabKey]}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="pt-6 mt-6">
              {selectedTab === 'uploadLeads' && (
                <div className="text-center bg-gray-50 rounded-md shadow-inner p-6">
                  {/* File Selector */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer text-center"
                  >
                    <FileImage className="mx-auto text-yellow-500 w-14 h-14 mb-2" />
                    <h6 className="text-black font-20 font-bold">Select CSV</h6>

                    {selectedFile && (
                      <p className="text-xs text-gray-600 mt-2">📁 {selectedFile.name}</p>
                    )}
                  </div>

                  <p className="text-xs text-gray-700 mb-6">
                    Upload a CSV file with lead information. We&apos;ll help you map the <br />
                    fields and score leads based on property details.
                  </p>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    className="hidden"
                    onClick={(e) => {
                      (e.target as HTMLInputElement).value = "";
                    }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                      }
                    }}
                  />

                  {/* Feedback Message */}
                  {message && (
                    <p className="mt-4 text-green-600 text-sm font-medium">{message}</p>
                  )}

                  {/* Next Button that imports file */}
                  <div className="mt-6 text-right">
                    <div className="mt-6 text-right">
                      {!isUploadSuccessful ? (
                        <button
                          onClick={handleImportClick}
                          className="px-4 py-2 text-xs text-white bg-blue-600 rounded hover:bg-blue-500"
                          disabled={isLoading || !selectedFile}
                        >
                          {isLoading ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />
                              Importing...
                            </>
                          ) : (
                            "Upload CSV"
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedTab("scoreFilter")}
                          className="px-4 py-2 text-xs text-white bg-green-600 rounded hover:bg-green-500"
                        >
                          Save & Next →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}


              {selectedTab === 'scoreFilter' && (
                <>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-2/5 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <h6 className="text-yellow-600 font-semibold text-xs mb-2">Lead Scoring</h6>
                      <p className="text-xs text-gray-600 mb-6">
                        Leads are scored from 0–100 based on various criteria.
                      </p>
                      <div className="flex justify-between">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-black">1</div>
                          <p className="text-xs text-gray-500">Hot Leads (80+)</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-black">57</div>
                          <p className="text-xs text-gray-500">Warm Leads (50–79)</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-black">1</div>
                          <p className="text-xs text-gray-500">Cold Leads (&lt;50)</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-3/5 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <h6 className="text-yellow-600 font-semibold text-xs mb-2">Score Threshold Filter</h6>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Min. Score: {minScore}</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={minScore}
                        onChange={(e) => setMinScore(Number(e.target.value))}
                        className="w-full accent-yellow-500"
                      />
                      <p className="text-right text-xs text-gray-500 mt-2">
                        {leads.filter((lead) => typeof lead.score === "number" && lead.score >= minScore).length} leads match
                      </p>

                    </div>
                  </div>
                  <div className="mt-6 flex justify-end text-xs">
                    <button
                      onClick={handleScoreNext}
                      className={`px-4 py-2 text-xs text-white rounded transition-all duration-200 ${minScore > 0
                        ? 'bg-blue-600 hover:bg-blue-500 cursor-pointer'
                        : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                      Save & Next →
                    </button>
                  </div>

                </>
              )}

              {selectedTab === "createLists" && (
                <div>
                  {/* Top Navigation */}
                  <div className="flex justify-between text-xs py-4">
                    <button
                      onClick={() => setSelectedTab("scoreFilter")}
                      className="px-4 py-2 text-xs text-white border border-gray-300 rounded hover:bg-blue-500 bg-blue-600"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={handleCreateListAndGoNext}
                      className="px-4 py-2 text-xs text-white bg-blue-600 rounded hover:bg-blue-500"
                    >
                      Save & Next →
                    </button>
                  </div>

                  {/* Lead Selection Panel */}
                  <div className="bg-orange-50 rounded border mb-4 shadow-lg px-2 py-2">
                    <h6 className="text-black font-bold py-2">Select leads to create a new list</h6>
                    <p className="text-xs text-gray-700 mb-2 ms-2">
                      Currently showing {leads.length} leads
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedLeads.length === leads.length}
                          onChange={toggleSelectAll}
                        />
                        <span>Select All</span>
                      </label>



                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedLeads([])}
                          className="text-sm px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                        >
                          Clear Selection
                        </button>

                      </div>
                    </div>
                  </div>

                  {/* Data Table */}
                  <div className="overflow-x-auto rounded">

                    <div className="bg-white rounded shadow-sm p-4">
                      <DataTable
                        columns={columns}
                        data={leads}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                        persistTableHead
                      />
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="mt-6 flex justify-between text-xs">
                    <button
                      onClick={() => setSelectedTab("scoreFilter")}
                      className="px-4 py-2 text-xs text-white border border-gray-300 rounded hover:bg-blue-500 bg-blue-600"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={handleCreateListAndGoNext}
                      className="px-4 py-2 text-xs text-white bg-blue-600 rounded hover:bg-blue-500"
                    >
                      Save & Next →
                    </button>
                  </div>
                </div>
              )}

              {selectedTab === 'market' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column: Lead List */}
                    <div className="bg-gray-50 rounded-lg p-4 shadow-lg">
                      <h4 className="text-md font-semibold mb-1 text-black">Select a Lead List</h4>
                      <p className="text-sm text-gray-600 mb-2">Choose a list for your marketing campaign</p>

                      <select
                        className="w-full rounded px-3 py-2 text-sm mb-3 text-black"
                        value={selectedList}
                        onChange={(e) => setSelectedList(e.target.value)}
                      >
                        <option value="">-- Select a Lead List --</option>

                        {leadstypes.map((lead: LeadType) => (
                          <option key={lead.id} value={lead.id}>
                            {lead.name} ({new Date(lead.created_at).toLocaleDateString()})
                          </option>
                        ))}
                      </select>
                    </div>


                    {/* Right Column: Marketing Channel */}
                    <div className="bg-gray-50 rounded-lg p-4 shadow-lg">
                      <h4 className="text-md font-semibold mb-1 text-black">Choose Marketing Channel</h4>
                      <p className="text-sm text-gray-600 mb-2">Select where to market this list</p>
                      <select
                        className="w-full rounded px-3 py-2 text-sm text-black border border-gray-300 mb-4"
                        value={selectedChannel}
                        onChange={(e) => setSelectedChannel(e.target.value)}
                      >
                        <option value="">Select marketing channel</option>
                        <option value="Campaign Manager">Campaign Manager</option>
                        <option value="Sequences">Sequences</option>
                        <option value="Call Dashboard">Call Dashboard</option>
                        <option value="Email Management">Email Management</option>
                      </select>


                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleContinueMarketing}
                      disabled={loading}
                      className={`w-30 bg-yellow-500 text-black text-sm font-medium py-2 px-4 rounded transition ${isLoading ? "cursor-not-allowed opacity-70" : "hover:bg-yellow-700"
                        }`}
                    >
                      {isLoading ? "Loading..." : "Final Submit"}
                    </button>



                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div >
    </div >
  );
}