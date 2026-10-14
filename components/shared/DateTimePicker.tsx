"use client";

import * as React from "react";
import { format, isValid, parse } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

// The picker stores its value as a local (wall-clock) "yyyy-MM-ddTHH:mm" string,
// matching the format produced by native datetime-local inputs. It is converted
// to a Date using date-fns without any forced timezone so display and submission
// follow the browser-local convention used by lib/format.
const VALUE_FORMAT = "yyyy-MM-dd'T'HH:mm";

function parseValue(value?: string): Date | undefined {
  if (!value) return undefined;
  const parsed = parse(value, VALUE_FORMAT, new Date());
  return isValid(parsed) ? parsed : undefined;
}

function combineDateTime(date: Date, time: string): string {
  const [hours, minutes] = time.split(":").map((part) => Number(part));
  const next = new Date(date);
  next.setHours(
    Number.isFinite(hours) ? hours : 0,
    Number.isFinite(minutes) ? minutes : 0,
    0,
    0,
  );
  return format(next, VALUE_FORMAT);
}

interface DateTimePickerProps {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  dateLabel?: string;
  timeLabel?: string;
}

export function DateTimePicker({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  invalid,
  className,
  dateLabel,
  timeLabel,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selected = parseValue(value);
  const timeValue = selected ? format(selected, "HH:mm") : "00:00";

  const handleSelect = (day?: Date) => {
    if (!day) {
      onChange("");
      return;
    }
    onChange(combineDateTime(day, timeValue));
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = event.target.value;
    if (!nextTime) return;
    onChange(combineDateTime(selected ?? new Date(), nextTime));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-left text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            !selected && "text-muted-foreground",
            invalid && "border-destructive focus-visible:ring-destructive/20",
            className,
          )}
        >
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
          <span className="line-clamp-1 flex-1">
            {selected ? formatDateTime(selected) : placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          defaultMonth={selected}
          autoFocus
        />
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-muted-foreground" />
            <label
              htmlFor={id ? `${id}-time` : undefined}
              className="text-sm text-muted-foreground"
            >
              {timeLabel}
            </label>
            <Input
              id={id ? `${id}-time` : undefined}
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
              disabled={disabled}
              className="ml-auto h-8 w-32"
            />
          </div>
          {dateLabel ? (
            <p className="mt-2 text-xs text-muted-foreground">{dateLabel}</p>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
