
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  placeholder?: string;
};

function toLocalDate(value: string): Date | null {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function BookingCalendar({
  value,
  onChange,
  minDate,
  placeholder = "Select date",
}: Props) {
  return (
    <DatePicker
      selected={toLocalDate(value)}
      onChange={(date: Date | null) => {
        if (date) {
          onChange(toDateString(date));
        }
      }}
      minDate={minDate ? toLocalDate(minDate) ?? undefined : undefined}
      dateFormat="dd MMMM yyyy"
      placeholderText={placeholder}
      showPopperArrow={false}
      className="smartstay-date-input"
      wrapperClassName="smartstay-date-wrapper"
    />
  );
}
