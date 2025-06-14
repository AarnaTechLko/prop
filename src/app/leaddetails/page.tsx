"use client";

import React, { useState } from "react";
import LeadDetailModal from "../dashboard/components/LeadDetailsModal"; // ✅ correct path
import type { Lead } from "@/app/types/types"; // ✅ Lead type import (ya inline bhi use kar sakte ho)

const DummyLeadsPage = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dummyLead: Lead = {
    id: 1,
    user_id: 101,
    first_name: "John",
    last_name: "Doe",
    street_address: "123 Street",
    city: "Cityname",
    state: "State",
    zip_code: "12345",
    mailing_street_address: "123 Mailing St",
    mailing_city: "MailCity",
    mailing_state: "MailState",
    phone1: "1234567890",
    phone1_type: "Mobile",
    phone2: "", phone2_type: "",
    phone3: "", phone3_type: "",
    phone4: "", phone4_type: "",
    phone5: "", phone5_type: "",
    email1: "john@example.com",
    email2: "", email3: "", email4: "", email5: "",
    social_network1: "Twitter",
    social_handle1: "@john",
    social_network2: "",
    social_handle2: "",
    apn: "APN123",
    vacant: 1,
    absentee: 0,
    occupancy: "Owner",
    ownership_type: "Single",
    formatted_apn: "APN-123",
    census_tract: "45678",
    subdivision: "Sub Name",
    tract_number: "1234",
    company_flag: 0,
    owner_type: "Individual",
    primary_owner_first: "John",
    primary_owner_middle: "Q",
    primary_owner_last: "Doe",
    secondary_owner_first: "",
    secondary_owner_middle: "",
    secondary_owner_last: "",
    assessor_last_sale_date: "2023-01-01",
    assessor_last_sale_amount: "500000",
    assessor_prior_sale_date: "2018-01-01",
    assessor_prior_sale_amount: "400000",
    area_building: "2000 sqft",
    living_sqft: 2000,
    area_lot_acres: "0.5",
    area_lot_sf: 21780,
    parking_garage: "Yes",
    pool: 0,
    bath_count: "2",
    bedrooms_count: 3,
    stories_count: 1,
    energy: "Electric",
    fuel: "Gas",
    estimated_value: "600000",
    estimated_min_value: "550000",
    estimated_max_value: "650000",
  };

  return (
    <div className="p-4">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => {
          setSelectedLead(dummyLead);
          setIsModalOpen(true);
        }}
      >
        View Lead Details
      </button>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DummyLeadsPage;
