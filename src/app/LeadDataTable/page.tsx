// app/LeadDataTable/page.tsx
import LeadDataTable from '../dashboard/components/LeadDataTable';

const dummyLeads = [
  {
    id: 1,
    first_name: 'Ravi',
    last_name: 'Sharma',
    city: 'Delhi',
    phone1: '9999999999',
    phone1_type: 'Mobile',
    leadtype: 1,
  },
  {
    id: 2,
    first_name: 'Anjali',
    last_name: 'Verma',
    city: 'Mumbai',
    phone1: '8888888888',
    phone1_type: 'Home',
    leadtype: 2,
  },
  {
    id: 3,
    first_name: 'Vikram',
    last_name: 'Singh',
    city: 'Jaipur',
    phone1: '7777777777',
    phone1_type: 'Work',
    leadtype: 1,
  },
];

export default function Page() {
  return <LeadDataTable leads={dummyLeads} selectedListId={1} />;
}
