export interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  city: string;
  phone1: string;
  phone1_type: string;
  leadtype: string; // Ensure this matches your actual data
}