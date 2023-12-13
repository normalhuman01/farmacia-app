import { isValid, parse, parseISO, subYears } from "date-fns";
import { format } from "date-fns/fp";

export const formatDateTime = format("dd/MM/yyyy HH:mm");

export const minYear = subYears(new Date(), 103);

export const today = new Date();

export const parseDate = (date: string) =>
  parse(date, "yyyy-MM-dd", new Date());

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?$/;

function isIsoDateString(value: any): boolean {
  return value && typeof value === "string" && isoDateFormat.test(value);
}

// See: https://stackoverflow.com/questions/65692061/casting-dates-properly-from-an-api-response-in-typescript
export function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== "object")
    return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) body[key] = parseISO(value);
    else if (isValid(parseDate(value))) body[key] = parseDate(value);
    else if (typeof value === "object") handleDates(value);
  }
}
