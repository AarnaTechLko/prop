"use client";

import React from "react";

interface Lead {
  id: number;
  user_id: number;
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
  social_handle1: string;
  social_network2: string;
  social_handle2: string;
  apn: string;
  vacant: number;
  absentee: number;
  occupancy: string;
  ownership_type: string;
  formatted_apn: string;
  census_tract: string;
  subdivision: string;
  tract_number: string;
  company_flag: number;
  owner_type: string;
  primary_owner_first: string;
  primary_owner_middle: string;
  primary_owner_last: string;
  secondary_owner_first: string;
  secondary_owner_middle: string;
  secondary_owner_last: string;
  assessor_last_sale_date: string;
  assessor_last_sale_amount: string;
  assessor_prior_sale_date: string;
  assessor_prior_sale_amount: string;
  area_building: string;
  living_sqft: number;
  area_lot_acres: string;
  area_lot_sf: number;
  parking_garage: string;
  pool: number;
  bath_count: string;
  bedrooms_count: number;
  stories_count: number;
  energy: string;
  fuel: string;
  estimated_value: string;
  estimated_min_value: string;
  estimated_max_value: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  lead: Lead;
}

export default function LeadDetailsModal({ open, onClose, lead }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-6 text-blue-600 border-b border-blue-200 pb-2">
          Lead Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Field label="Lead ID" value={lead.id} />
          <Field label="User ID" value={lead.user_id} />
          <Field label="First Name" value={lead.first_name} />
          <Field label="Last Name" value={lead.last_name} />
          <Field label="City" value={lead.city} />
          <Field label="State" value={lead.state} />
          <Field label="Phone 1" value={`${lead.phone1} (${lead.phone1_type})`} />
          <Field label="Email 1" value={lead.email1} />
          <Field label="Vacant" value={lead.vacant ? "Yes" : "No"} />
          <Field label="Absentee" value={lead.absentee ? "Yes" : "No"} />
          <Field label="Pool" value={lead.pool ? "Yes" : "No"} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <span className="text-gray-900 font-semibold">{label}:</span>{" "}
      <span className="text-gray-400 font-medium">{value || "N/A"}</span>
    </div>
  );
}
