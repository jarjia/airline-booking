import { fromJSON } from "postcss";

// Date picker component data
type DatePickerData = {
  dateString: string | null;
  date: "from" | "to";
  location: "origin" | "destination";
  error?: boolean;
};

// Final form submission data
type FinalData = {
  to?: string;
  from: string;
  origin: string;
  destination: string;
  tripType: "one-way" | "roundtrip";
};

// Server response data
type BookingData = {
  bookingId: string;
  status: string;
  timestamp: string;
};
