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
          <>
            <div className="absolute flex flex-col items-center justify-center tiny-max:w-full tiny-max:left-0 top-1/4 left-1/4 rounded-lg p-4 w-1/2 h-1/2 z-[20] bg-white shadow-2xl">
              <div className="flex flex-col gap-2">
                <p>Booking Id: {bookingData.bookingId}</p>
                <p>Status: {bookingData.status}</p>
                <p>
                  TimeStamp:{" "}
                  {new Date(bookingData.timestamp).toLocaleDateString("en-GB")}
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setBookingData(null)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div
              onClick={() => setBookingData(null)}
              className="fixed top-0 left-0 bg-black bg-opacity-40 w-screen h-screen z-[19]"
            ></div>
          </>
        )}
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-2 sm-max:grid-cols-1 items-center"
          >
            <div className="flex flex-col gap-10">
              <div className="flex justify-between sm-max:justify-around tiny-max:justify-center tiny-max:items-center tiny-max:flex-col tiny-max:gap-6 gap-1">
                <Dropdown destinations={destinations} location="origin" />
                <Dropdown destinations={destinations} location="destination" />
              </div>
              <div className="flex justify-between sm-max:justify-around tiny-max:justify-center tiny-max:items-center tiny-max:flex-col tiny-max:gap-6 gap-1">
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
              <div className="sm-max:flex justify-center items-center hidden w-full">
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
                rules={{ required: "Flight type is required" }}
                render={({ field }) => (
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value="roundtrip"
                        checked={field.value === "roundtrip"}
                        onChange={() => field.onChange("roundtrip")}
                        className="hidden peer"
                      />
                      <span className="w-5 h-5 border-2 border-black rounded-full flex items-center justify-center peer-checked:border-black">
                        <div
                          style={{
                            display:
                              field.value === "roundtrip" ? "block" : "none",
                          }}
                          className="w-2 h-2 bg-black rounded-full peer-checked:block"
                        ></div>
                      </span>
                      <span>Roundtrip</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value="one-way"
                        checked={field.value === "one-way"}
                        onChange={() => field.onChange("one-way")}
                        className="hidden peer"
                      />
                      <span className="w-5 h-5 border-2 border-black rounded-full flex items-center justify-center peer-checked:border-black">
                        <div
                          style={{
                            display:
                              field.value === "one-way" ? "block" : "none",
                          }}
                          className="w-2 h-2 bg-black rounded-full peer-checked:block"
                        ></div>
                      </span>
                      <span>One-way</span>
                    </label>
                  </div>
                )}
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
