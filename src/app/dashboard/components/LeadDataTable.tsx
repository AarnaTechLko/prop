// components/LeadDataTable.tsx
'use client';

import DataTable, { TableColumn } from 'react-data-table-component';

interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  city: string;
  phone1: string;
  phone1_type: string;
  leadtype: number;
}

interface Props {
  leads: Lead[];
  selectedListId: number;
}

const LeadDataTable = ({ leads, selectedListId }: Props) => {
  const filteredLeads = leads.filter((lead) => lead.leadtype === selectedListId);

  const columns: TableColumn<Lead>[] = [
    { name: 'First Name', selector: row => row.first_name, sortable: true },
    { name: 'Last Name', selector: row => row.last_name, sortable: true },
    { name: 'City', selector: row => row.city, sortable: true },
    { name: 'Phone', selector: row => row.phone1, sortable: true },
    { name: 'Type', selector: row => row.phone1_type, sortable: true },
  ];

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded shadow-sm">
      <DataTable
        title="Leads"
        columns={columns}
        data={filteredLeads}
        pagination
        highlightOnHover
        striped
        responsive
        defaultSortFieldId={1}
        noDataComponent="Lead data not found"
      />
    </div>
  );
};

export default LeadDataTable;
