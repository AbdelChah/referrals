import { format } from "date-fns";

export const formatDate = (date: string): string => {
  return format(new Date(date), "MMMM d, yyyy"); // Example: February 1, 2025
};
