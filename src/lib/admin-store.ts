import { createClient } from "@supabase/supabase-js";
import {
  ADMIN_PASSWORD_ROW_ID,
  ADMIN_PASSWORD_TABLE,
} from "@/lib/admin-session";
import { settings } from "@/lib/settings";
import {
  isMissingSchemaError,
  setupRequiredMessage,
} from "@/lib/supabase-errors";

function createAdminClient() {
  if (!settings.supabaseUrl || !settings.supabaseServiceRoleKey) {
    return null;
  }

  return createClient(settings.supabaseUrl, settings.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export type AdminPasswordState =
  | { status: "configured"; passwordHash: string }
  | { status: "missing" }
  | { status: "unconfigured" }
  | { status: "setup-required"; message: string };

export async function getAdminPasswordState(): Promise<AdminPasswordState> {
  const client = createAdminClient();

  if (!client) {
    return { status: "unconfigured" };
  }

  const { data, error } = await client
    .from(ADMIN_PASSWORD_TABLE)
    .select("password_hash")
    .eq("id", ADMIN_PASSWORD_ROW_ID)
    .maybeSingle();

  if (isMissingSchemaError(error)) {
    return {
      status: "setup-required",
      message: setupRequiredMessage("The public.admin_settings table"),
    };
  }

  if (error) {
    return {
      status: "setup-required",
      message: error.message,
    };
  }

  if (!data?.password_hash) {
    return { status: "missing" };
  }

  return { status: "configured", passwordHash: data.password_hash as string };
}

export async function getStoredAdminPasswordHash() {
  const state = await getAdminPasswordState();

  return state.status === "configured" ? state.passwordHash : null;
}

export async function saveAdminPasswordHash(passwordHash: string) {
  const client = createAdminClient();

  if (!client) {
    return {
      ok: false,
      message: "Supabase service role key is required for setup.",
    };
  }

  const { error } = await client.from(ADMIN_PASSWORD_TABLE).upsert({
    id: ADMIN_PASSWORD_ROW_ID,
    password_hash: passwordHash,
  });

  if (error) {
    return {
      ok: false,
      message: isMissingSchemaError(error)
        ? setupRequiredMessage("The public.admin_settings table")
        : error.message,
    };
  }

  return { ok: true, message: "" };
}
