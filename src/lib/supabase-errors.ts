import type { PostgrestError } from "@supabase/supabase-js";

export function isMissingSchemaError(error: PostgrestError | null) {
  if (!error) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    message.includes("schema cache") ||
    message.includes("could not find the table") ||
    message.includes("relation") && message.includes("does not exist")
  );
}

export function setupRequiredMessage(resource: string) {
  return `${resource} is missing in Supabase. Run supabase/setup.sql in the Supabase SQL editor, then retry.`;
}
