import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { DatePickerData } from "@/types/types";

type CalendarProps = {
  calendar: DatePickerData | null;
  handleCalendarSelect: (date: Date) => void;
  selectedDate: Date | null;
  handleDisabledWeekDays: (date: Date) => boolean;
};

const Calendar = ({
  calendar,
  handleCalendarSelect,
  selectedDate,
  handleDisabledWeekDays,
}: CalendarProps) => {
  return (
    <div
      className={`${
        calendar ? "scale-100 tiny-max:h-auto" : "scale-0 tiny-max:h-0"
      } flex flex-col justify-center items-center transition-transform duration-200`}
    >
      {calendar && (
        <div className="relative w-full text-center h-0 -top-7">
          <span className="capitalize text-lg">{calendar?.date} Date</span>
        </div>
      )}
      <CalendarUI
        mode="single"
        onSelect={(val: Date | undefined) => val && handleCalendarSelect(val)}
        className="font-display rounded-2xl m-auto shadow-calendar w-fit"
        classNames={{
          day: "rounded-xl w-8 h-8 hover:bg-gray-200",
          day_selected: "bg-calendar-item hover:!bg-calendar-item text-white",
          day_outside: "text-outside-month",
        }}
        selected={
          selectedDate ||
          (calendar && calendar.dateString
            ? new Date(calendar.dateString.split("-").reverse().join("-"))
            : undefined)
        }
        disabled={(date) => handleDisabledWeekDays(date)}
      />
    </div>
  );
};

export default Calendar;
