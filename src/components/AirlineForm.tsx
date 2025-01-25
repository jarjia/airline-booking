"use client";
import { FlightDestination } from "@/types/FlightDestination";
import Bounded from "./Bounded";
import Dropdown from "./Dropdown";
import DatePicker from "./DatePicker";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Controller, FormProvider, useForm } from "react-hook-form";
import Calendar from "./Calendar";
import useAirlineForm from "@/hooks/useAirlineForm";
// TODO: implement the airlineForm component

export interface AirlineFormProps {
  destinations: FlightDestination[];
}

export const AirlineForm = ({ destinations }: AirlineFormProps) => {
  // Use hook to seperate logic from the component
  const {
    form,
    calendar,
    selectedDate,
    bookingData,
    onSubmit,
    setBookingData,
    setSelectedDate,
    handleCalendarSelect,
    handleDatePicker,
    handleDisabledWeekDays,
  } = useAirlineForm({ destinations });

  return (
    <Bounded>
      <>
        {bookingData && (
          <div className="absolute flex flex-col items-center justify-center top-1/4 left-1/4 rounded-lg p-4 w-1/2 h-1/2 z-[20] bg-white shadow-2xl">
            <div className="flex flex-col gap-2">
              <p>Booking Id: {bookingData.bookingId}</p>
              <p>Status: {bookingData.status}</p>
              <p>
                TimeStamp:{" "}
                {new Date(bookingData.timestamp).toLocaleDateString("en-GB")}
              </p>
              <Button variant="secondary" onClick={() => setBookingData(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-2 sm-max:grid-cols-1 items-center"
          >
            <div className="flex flex-col gap-10">
              <div className="flex justify-between tiny-max:items-center tiny-max:flex-col tiny-max:gap-6 gap-1">
                <Dropdown destinations={destinations} location="origin" />
                <Dropdown destinations={destinations} location="destination" />
              </div>
              <div className="flex justify-between tiny-max:items-center tiny-max:flex-col tiny-max:gap-6 gap-1">
                <DatePicker
                  date="from"
                  location="origin"
                  destinations={destinations}
                  handleDatePicker={handleDatePicker}
                />
                <DatePicker
                  date="to"
                  location="destination"
                  destinations={destinations}
                  handleDatePicker={handleDatePicker}
                />
              </div>
              <div
                className="sm-max:flex justify-center items-center hidden w-full"
                style={{ height: calendar ? "auto" : 0 }}
              >
                <Calendar
                  calendar={calendar}
                  handleCalendarSelect={handleCalendarSelect}
                  selectedDate={selectedDate}
                  handleDisabledWeekDays={handleDisabledWeekDays}
                />
              </div>
              <Controller
                name="tripType"
                control={form.control}
                shouldUnregister
                rules={{ required: "Flight type is required" }}
                render={({ field }) => {
                  console.log(field);

                  return (
                    <>
                      <RadioGroup
                        {...field}
                        className="flex justify-start sm-max:justify-center items-center"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            className="w-5 h-5"
                            value="roundtrip"
                            id="roundtrip"
                            checked={field.value === "roundtrip"}
                            onClick={() => field.onChange("roundtrip")}
                          />
                          <Label htmlFor="roundtrip">Roundtrip</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            className="w-5 h-5"
                            value="one-way"
                            id="one-way"
                            checked={field.value === "one-way"}
                            onClick={() => {
                              field.onChange("one-way");
                              if (calendar?.date === "to") {
                                setSelectedDate(null);
                              }
                            }}
                          />
                          <Label htmlFor="one-way">One-way</Label>
                        </div>
                        {form.formState.errors.tripType && (
                          <span className="text-red-500 m-0 p-0 text-sm">
                            {typeof form.formState.errors.tripType?.message ===
                              "string" &&
                              form.formState.errors.tripType.message}
                          </span>
                        )}
                      </RadioGroup>
                    </>
                  );
                }}
              />
              <Button
                type="submit"
                variant="default"
                className="bg-calendar-item sm-max:m-auto rounded-2xl w-fit"
              >
                Book Flight
              </Button>
            </div>
            <div className="sm-max:hidden block">
              <Calendar
                calendar={calendar}
                handleCalendarSelect={handleCalendarSelect}
                selectedDate={selectedDate}
                handleDisabledWeekDays={handleDisabledWeekDays}
              />
            </div>
          </form>
        </FormProvider>
      </>
    </Bounded>
  );
};
