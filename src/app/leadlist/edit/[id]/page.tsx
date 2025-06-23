'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/dashboard/components/Sidebar';
import Topbar from '@/app/dashboard/components/Topbar';
import Swal from 'sweetalert2';

interface EditLeadPageProps {
  params: Promise<{ id: string }>;
}

interface Lead {
  markettype: string;
  leadtype: string;
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

export default function EditLeadPage(props: EditLeadPageProps) {
  const { id } = use(props.params);
  const [lead, setLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchLead() {
      const res = await fetch(`/api/leads/${id}`);
      const data = await res.json();
      setLead(data);
      setFormData(data);
    }
    fetchLead();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: 'Lead updated successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
        router.push('/leadlist');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update the lead.',
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (key: string) => (
    <div key={key} className="flex flex-col">
      <label className="text-xs font-semibold capitalize mb-1 text-gray-700">
        {key.replace(/_/g, ' ')}
      </label>
      <input
        type={typeof lead?.[key as keyof Lead] === 'number' ? 'number' : 'text'}
        name={key}
        value={formData[key as keyof Lead] ?? ''}
        onChange={handleChange}
        className="border border-gray-300 px-2 py-1 rounded text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
      />
    </div>
  );

  if (!lead) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-x-hidden">
        <Topbar />
        <div className="p-6 overflow-y-auto max-h-screen">
          <h1 className="text-xl font-bold mb-6">Edit Lead</h1>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* 🏷️ Owner Info */}
            <Section title="Owner Info" keys={[
              "first_name", "last_name", "primary_owner_first", "primary_owner_middle", "primary_owner_last",
              "secondary_owner_first", "secondary_owner_middle", "secondary_owner_last", "owner_type", "company_flag"
            ]} />

            {/* 📞 Contact Info */}
            <Section title="Contact Info" keys={[
              "phone1", "phone1_type", "phone2", "phone2_type", "phone3", "phone3_type",
              "phone4", "phone4_type", "phone5", "phone5_type", "email1", "email2", "email3",
              "email4", "email5", "social_network1", "social_network2", "social_handle1", "social_handle2"
            ]} />

            {/* 🏠 Property Info */}
            <Section title="Property Info" keys={[
              "street_address", "city", "state", "zip_code", "markettype", "leadtype",
              "apn", "formatted_apn", "census_tract", "subdivision", "tract_number", "vacant",
              "absentee", "occupancy", "ownership_type", "area_building", "living_sqft",
              "area_lot_acres", "area_lot_sf", "parking_garage", "pool", "bath_count",
              "bedrooms_count", "stories_count", "energy", "fuel", "score", "status"
            ]} />

            {/* 📬 Mailing Address */}
            <Section title="Mailing Address" keys={[
              "mailing_street_address", "mailing_city", "mailing_state"
            ]} />

            {/* 💰 Sale & Valuation */}
            <Section title="Sale & Valuation" keys={[
              "assessor_last_sale_date", "assessor_prior_sale_date", "assessor_prior_sale_amount",
              "estimated_value", "estimated_min_value"
            ]} />

            {/* ✅ Submit Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => router.push('/leadlist')}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm flex items-center gap-2 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Inner Section Component
  function Section({ title, keys }: { title: string; keys: string[] }) {
    return (
      <div>
        <h2 className="text-md font-semibold text-gray-700 mb-2">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {keys.map((key) => renderInput(key))}
        </div>
      </div>
    );
  }
}
