import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AirlineFormProps } from "./AirlineForm";
import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { capitalizeFirstLetter, parseDate } from "@/helpers";
import { DatePickerData } from "@/types/types";

type DatePickerProps = {
  date: "from" | "to";
  location: "origin" | "destination";
  handleDatePicker: (datePickerData: DatePickerData) => void;
};

const DatePicker = ({
  date,
  location,
  destinations,
  handleDatePicker,
}: DatePickerProps & AirlineFormProps) => {
  const params = useSearchParams();
  const {
    register,
    setValue,
    getValues,
    setError,
    formState: { errors },
    clearErrors,
  } = useFormContext();
  const dateString = useWatch({ name: date });
  const tripType = useWatch({ name: "tripType" });
  // Returns true if trip type is "one-way" and date picker is for "to" date
  const dateDisabled = tripType === "one-way" && date === "to";

  useEffect(() => {
    // Set values from URL params to apply history changes on UI
    const dateParam = params.get(date);
    setValue(date, dateParam ? dateParam.replace(/-/g, "/") : "");
  }, [params, date, destinations]);

  useEffect(() => {
    if (location && dateString) {
      const availableWeekdays = destinations.find(
        (destination) => destination.code === params.get(location)
      )?.availableWeekdays;
      const weekDay = parseDate(dateString, "/").getDay();

      // check if date is available for the country
      if (!availableWeekdays?.includes(weekDay) && !dateDisabled) {
        setError(date, {
          type: "custom",
          message: "Date is not available or is invalid",
        });
        handleDatePicker({
          date,
          location,
          dateString,
        });
      } else {
        clearErrors(date);
      }
    }
  }, [params, location, date, dateString]);

  return (
    <div>
      <div className="relative select-none pointer-events-none left-2 -top-2">
        <label
          htmlFor={date}
          className={`${
            dateDisabled ? "opacity-30" : "opacity-100"
          } capitalize absolute px-1 bg-white rounded-full z-[3] text-tiny font-display`}
        >
          {date}
        </label>
      </div>
      <div
        onClick={() => {
          if (!dateDisabled) {
            handleDatePicker({
              date,
              dateString,
              location,
            });
          }
        }}
        className={`${
          dateDisabled ? "cursor-not-allowed" : "cursor-pointer"
        } w-fit ${dateDisabled ? "opacity-50" : "opacity-100"}`}
      >
        <Input
          id={date}
          type="text"
          placeholder="Select date"
          {...register(date, {
            required: {
              value: dateDisabled ? false : true,
              message: `${capitalizeFirstLetter(date)} date is required`,
            },
            validate: (value) => {
              if (tripType !== "one-way") {
                const parsedDate = parseDate(value, "/");
                const otherDate = parseDate(
                  getValues(date === "from" ? "to" : "from"),
                  "/"
                );

                if (date === "from" && parsedDate > otherDate) {
                  return `${capitalizeFirstLetter(
                    date
                  )} date cannot be in the future`;
                }
                if (date === "to" && parsedDate < otherDate) {
                  return `${capitalizeFirstLetter(
                    date
                  )} date cannot be in the past`;
                }
              }
            },
          })}
          disabled
          className={`${
            errors[date] ? "border-red-500" : "border-primary"
          } pointer-events-none placeholder:select-none rounded-2xl w-56 hover:bg-white font-body py-6 px-11 text-center !cursor-pointer !opacity-100 outline-none`}
        />
      </div>
      {errors && errors[date] && (
        <div className="relative mb-4">
          <span className="absolute px-1 text-red-500 rounded-full text-sm font-display">
            {errors[date]?.message ? (errors[date]?.message as string) : ""}
          </span>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
