// components/UploadLeads.tsx
import React, { useRef } from "react";

export default function UploadLeads() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/leads/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    console.log("Upload result:", result);
    alert(result.message || "File uploaded!");
  };

  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload Leads CSV
      </button>

      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleCSVUpload}
        className="hidden"
      />
    </>
  );
}
