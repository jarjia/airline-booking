import { AirlineFormProps } from "@/components/AirlineForm";
import { BookingData, DatePickerData, FinalData } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { book } from "@/actions/book";

const useAirlineForm = ({ destinations }: AirlineFormProps) => {
  const params = useSearchParams();
  const router = useRouter();
  const [calendar, setCalendar] = useState<DatePickerData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const form = useForm<FinalData>();
  const tripType = useWatch({ name: "tripType", control: form.control });

  // Reset selected date when date picker changes
  useEffect(() => {
    setSelectedDate(null);
  }, [calendar?.date]);

  useEffect(() => {
    if (tripType === "one-way") setCalendar(null);
  }, [tripType]);

  const onSubmit: SubmitHandler<FinalData> = async (data) => {
    // Process data before sending to the server action
    const newData = { ...data };
    if (data.tripType === "one-way") {
      delete newData.to;
    }

    if (data.from) {
      newData.from = data.from.replace(/\//g, "-");
    }

    if (data.to) {
      newData.to = data.to.replace(/\//g, "-");
    }

    // Send data to server action
    const res = await book(newData);
    setBookingData(res.data);
    setCalendar(null);
    form.reset();
    router.push("/");
  };

  const handleDatePicker = (datePickerData: DatePickerData) => {
    // Check for different date to play animation
    if (calendar?.date !== datePickerData.date) {
      setCalendar(null);
      setTimeout(() => {
        setCalendar(datePickerData);
      }, 100);
    } else {
      setCalendar(datePickerData);
    }
  };

  // Disable weekdays that are not available
  const handleDisabledWeekDays = (date: Date) => {
    const location = calendar?.location;

    if (location) {
      const disabledWeekdays = destinations.find(
        (destination) => destination.code === params.get(location)
      )?.availableWeekdays;

      const day = date.getDay();
      return !disabledWeekdays?.includes(day);
    } else {
      return true;
    }
  };

  const handleCalendarSelect = (value: Date | undefined) => {
    const dateFormat = "en-GB";
    const date = value?.toLocaleDateString(dateFormat);

    setSelectedDate(value ?? null);

    if (calendar?.date) {
      const currentParams = new URLSearchParams(params.toString());
      if (calendar?.date && date) {
        currentParams.set(calendar.date, date.replace(/\//g, "-"));
      }

      router.push(`?${currentParams.toString()}`);
    }
  };

  return {
    form,
    calendar,
    selectedDate,
    bookingData,
    tripType,
    setBookingData,
    setValue: form.setValue,
    handleDatePicker,
    handleDisabledWeekDays,
    handleCalendarSelect,
    onSubmit,
    setSelectedDate,
  };
};

export default useAirlineForm;
