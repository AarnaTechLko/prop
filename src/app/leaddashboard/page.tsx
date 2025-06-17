'use client';

import { useState, useRef, useEffect } from 'react';
import { FileImage } from 'lucide-react';
import Swal from 'sweetalert2';
import Sidebar from '../dashboard/components/Sidebar';
import Topbar from '../dashboard/components/Topbar';
import Papa from 'papaparse';
interface Lead {
  id: string;
  first_name?: string;
  phone1?: string;
  score: number;
  [key: string]: unknown;

}


interface CsvRow {
  "First Name"?: string;
  "Phone 1"?: string;
  "Score"?: string | number;
}
export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState<'uploadLeads' | 'scoreFilter' | 'createLists' | 'market'>('uploadLeads');
  const [minScore, setMinScore] = useState(50);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
const [loading, setLoading] = useState(false);

  type TabKey = 'uploadLeads' | 'scoreFilter' | 'createLists' | 'market';

  const labelMap = {
    uploadLeads: 'Upload Leads',
    scoreFilter: 'Score Filter',
    createLists: 'Create Lists',
    market: 'Market',
  } as const;

  // const leads = Array.from({ length: 5 }, (_, i) => ({
  //   id: String(i + 1),
  //   added: '4/11/2025',
  //   score: 55,
  // }));

  const toggleSelectAll = () => {
    const allSelected = selectedLeads.length === leads.length;
    setSelectedLeads(allSelected ? [] : leads.map((lead) => lead.id));
  };
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const parsed = (results.data as CsvRow[]).map((row, index) => ({
          id: String(Date.now() + index),
          first_name: row["First Name"]?.trim() || "",
          phone1: row["Phone 1"]?.trim() || "",
          score: Number(row["Score"] || 0),
        }));
        setLeads(parsed);
        setSelectedLeads([]);
        // setSelectedTab("scoreFilter");
      },
    });

    setFile(file);
    setMessage('');
    const formData = new FormData();
    formData.append('file', file);

    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("No userId found in localStorage");
      Swal.fire({
        icon: 'error',
        title: 'Missing User ID',
        text: 'No userId found in localStorage.',
      });
      return;
    }

    try {
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
        headers: {
          'x-user-id': userId,
        },
      });

      const text = await response.text();

      try {
        const json = JSON.parse(text);

        if (!response.ok) {
          console.error('Upload failed:', json.error || response.statusText);
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: json.error || response.statusText,
          });
        } else {
          console.log('Upload success:', json);
          Swal.fire({
            icon: 'success',
            title: 'Upload Successful',
            text: 'Your file has been uploaded successfully!',
          });
        }
      } catch {
        console.error('Upload error: Invalid JSON:', text);
        Swal.fire({
          icon: 'error',
          title: 'Upload Error',
          text: 'Server responded with invalid data.',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Something went wrong while uploading the file.',
      });
    }
  };

  const handlePrevStep = () => {
    setSelectedTab('uploadLeads');
  };

  const handleNextStepFromScoreFilter = () => {
    setSelectedTab('createLists'); // or whatever your next step is
  };

  const handlePrevStepFromCreateList = () => {
    setSelectedTab('scoreFilter'); // go back to score filtering
  };

  const handleNextStepFromCreateList = () => {
    setSelectedTab('market'); // go to final step or confirmation
  };

  const handlePrevStepFromMarket = () => {
    setSelectedTab('createLists'); // Go back to the previous step
  };


  useEffect(() => {
    const fetchLeads = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await fetch("/api/createlist", {
          method: "GET",
          headers: { "x-user-id": userId },
        });

        const data = await response.json();
        if (data.success) {
          setLeads(data.data);
        } else {
          console.error("Failed to fetch leads:", data.message);
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };

    fetchLeads();
  }, []);



  const handleScoreUpdate = async () => {
      setLoading(true); // Show loader

    console.log("Raw leads:", leads);
    console.log("Min score (selected score):", minScore, "Type:", typeof minScore);

    const selectedScore = Number(minScore); // Use minScore as the selected score
    if (isNaN(selectedScore)) {
      console.error("❌ Invalid selected score value:", minScore);
          setLoading(false);
      return;
    }

    // Filter leads you want to update (optional condition — here we accept all with a valid ID)
    const leadsToUpdate = leads
      .filter((lead) => {
        const isValid = lead?.id != null;
        // console.log(`Checking lead id: ${lead.id}, valid: ${isValid}`);
        return isValid;
      })
      .map((lead) => ({
        id: lead.id,
        score: selectedScore, // ✅ Set score to the selected score
      }));

    console.log("✅ Leads to update:", leadsToUpdate);

    if (leadsToUpdate.length === 0) {
      console.log("No leads meet the score criteria.");
          setLoading(false);

      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found.");
          setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/update-scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(leadsToUpdate),
      });

       const result = await response.json();
    if (response.ok) {
      console.log("✅ Scores updated successfully:", result);
      Swal.fire({
        icon: 'success',
        title: 'Scores Updated',
        text: 'All selected leads have been updated successfully!',
      });
    } else {
      console.error("❌ Failed to update scores:", result.error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: result.error || 'Something went wrong while updating scores.',
      });
    }
  } catch (err) {
    console.error("🚨 Error while updating scores:", err);
    Swal.fire({
      icon: 'error',
      title: 'Network Error',
      text: 'Could not connect to the server.',
    });
  } finally {
    setLoading(false); // Hide loader
  }
  };



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

  const handleCreateList = async () => {
      setLoading(true);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found");
          setLoading(false);

      return;
    }

    const payload = leads
      .filter((lead) => selectedLeads.includes(lead.id))
      .map((lead) => ({
        user_id: Number(userId),
        first_name: lead.first_name || null,
        phone1: lead.phone1 || null,
        score: lead.score || 0,
      }));

    try {
      const response = await fetch("/api/save-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ leads: payload }), // ✅ FIXED
      });

      const result = await response.json();
      if (response.ok) {
        console.log("✅ Leads saved successfully:", result);
            window.location.reload();
      } else {
        console.error("❌ Failed to save leads:", result);
      }
    } catch (err) {
      console.error("🚨 Error saving leads:", err);
    }finally {
    setLoading(false);
  }
  };



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
                href="/files/prop99.csv"
                download="prop99.csv"
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
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'bg-orange-50 text-gray-700 hover:bg-white hover:text-black hover:shadow'
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
                  <FileImage className="mx-auto text-yellow-500 w-14 h-14 mb-4" />
                  <h6 className="text-black text-xs font-bold">Import Leads</h6>
                  <p className="text-xs text-gray-700 mb-6">
                    Upload a CSV file with lead information. We&apos;ll help you map the <br /> fields and score leads based on property details.
                  </p>
                  <div>
                    <button onClick={handleImportClick} className="text-xs bg-yellow-500 px-4 py-2 rounded">Import Lead</button>

                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept=".csv"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    {file && <p className="mt-2 text-gray-700 text-sm">File ready to upload: {file.name}</p>}
                    {message && <p className="mt-4 text-green-600 text-sm font-medium">{message}</p>}
                  </div>
                </div>
              )}

              {selectedTab === 'scoreFilter' && (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-2/5 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h6 className="text-yellow-500 font-semibold text-xs mb-2">Lead Scoring</h6>
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


                    <div className="mt-4 flex space-x-3">
                      <button className="px-4 py-2 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-100 transition">Show Preview</button>
                      <button
                        onClick={() => {
                          handleScoreUpdate();
                          // setSelectedTab("createLists");
                        }}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs transition"
                      >
                        Continue to Selection
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === "createLists" && (
                <div>
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
                        {/* <button
                          disabled={selectedLeads.length === 0}
                          className={`text-sm px-4 py-2 rounded text-white transition ${selectedLeads.length === 0
                            ? "bg-yellow-300 cursor-not-allowed"
                            : "bg-yellow-500 hover:bg-yellow-600"
                            }`}
                        >
                          Create List ({selectedLeads.length})
                        </button> */}
                        <button
                          onClick={handleCreateList}
                          disabled={selectedLeads.length === 0}
                          className={`text-sm px-4 py-2 rounded text-white transition ${selectedLeads.length === 0
                            ? "bg-yellow-300 cursor-not-allowed"
                            : "bg-yellow-500 hover:bg-yellow-600"
                            }`}
                        >
                          Create List ({selectedLeads.length})
                        </button>

                      </div>
                    </div>
                  </div>

                  {/* Lead Table */}
                  <div className="overflow-x-auto rounded">
                    <table className="min-w-full text-sm text-left text-gray-700">
                      <thead className="bg-gray-100 text-xs text-gray-600">
                        <tr>
                          <th className="px-4 py-2">Select</th>
                          <th className="px-4 py-2">Lead</th>
                          <th className="px-4 py-2">Contact</th>
                          <th className="px-4 py-2">Status</th>
                          <th className="px-4 py-2">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead) => (
                          <tr key={lead.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">
                              <input
                                type="checkbox"
                                checked={selectedLeads.includes(lead.id)}
                                // onChange={() => toggleLead(lead.id)}
                              />
                            </td>
                            <td className="px-4 py-2">{lead.first_name?.trim() || ""}</td>
                            <td className="px-4 py-2">{lead.phone1?.trim() || ""}</td>
                            <td className="px-4 py-2">
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded">pending</span>
                            </td>
                            <td className="px-4 py-2">
                              <span className="bg-yellow-100 text-yellow-600 px-2 py-1 text-xs rounded">
                                {lead.score}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex justify-between text-xs">
                    <button
                      onClick={() => setSelectedTab("scoreFilter")}
                      className="px-4 py-2 text-xs text-white border border-gray-300 rounded hover:bg-gray-500 bg-gray-400"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setSelectedTab("market")}
                      className="px-4 py-2 text-xs text-white bg-gray-400 rounded hover:bg-gray-500"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
              {selectedTab === 'market' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 shadow-lg">
                    <h4 className="text-md font-semibold mb-1 text-black">Select a Lead List</h4>
                    <p className="text-sm text-gray-600 mb-2">Choose a list for your marketing campaign</p>
                    <select className="w-full rounded px-3 py-2 text-sm mb-3 text-black">
                      <option>Propwire Export - 28 Properties - Jun 11, 2024 (27 leads)</option>
                      <option>Primary Leads (2 leads)</option>
                      <option>Cold Leads (1 lead)</option>
                    </select>
                    <div className="bg-white border rounded p-3 text-sm">
                      <p className="font-medium text-gray-800 mb-1">Propwire Export - Jun 11, 2024</p>
                      <p className="text-gray-500">No description</p>
                      <div className="flex justify-between mt-2">
                        <span className="text-black">Total Leads:</span>
                        <span className="font-semibold text-black">27</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">High Value Leads:</span>
                        <span className="font-semibold text-black">0</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 shadow-lg">
                    <h4 className="text-md font-semibold mb-1 text-black">Choose Marketing Channel</h4>
                    <p className="text-sm text-gray-600 mb-2">Select where to market this list</p>
                    <select className="w-full rounded px-3 py-2 text-sm text-black border border-gray-300 mb-4">
                      <option>Select marketing channel</option>
                      <option>Campaign Manager</option>
                      <option>Sequences</option>
                      <option>Call Dashboard</option>
                      <option>Email Management</option>
                    </select>
                    <button
                      onClick={() => console.log('Continue to Marketing clicked')}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium py-2 px-4 rounded transition"
                    >
                      Continue to Marketing
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}