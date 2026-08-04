import "server-only";

import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";
import {
  blogCards as fallbackBlogCards,
  education as fallbackEducation,
  events as fallbackEvents,
  projects as fallbackProjects,
  skills as fallbackSkills,
  technologies as fallbackTechnologies,
} from "@/lib/content";
import { settings } from "@/lib/settings";

type EducationItem = {
  title: string;
  subtitle: string;
  period: string;
  details: string[];
};

type SupabaseSkillRow = {
  id: string | number;
  name: string;
  category: string;
};

type SupabaseProjectRow = {
  id: string | number;
  title: string;
  description: string;
  href: string;
  stack: string[] | string | null;
};

type SupabaseBlogCardRow = {
  id: string | number;
  title: string;
  href: string;
  cover_image_url?: string | null;
  size_class?: string | null;
};

type SupabaseEventRow = {
  id: string | number;
  title: string;
  description: string;
  image_url: string | null;
  date?: string | null;
};

function createSupabaseServerClient() {
  if (!settings.supabaseUrl || !settings.supabaseAnonKey) {
    return null;
  }

  return createClient(settings.supabaseUrl, settings.supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeStack(stack: string[] | string | null | undefined) {
  if (Array.isArray(stack)) {
    return stack.filter(Boolean);
  }

  if (typeof stack === "string") {
    return stack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function toFallbackEducation(items: typeof fallbackEducation): EducationItem[] {
  return items.map((item) => ({
    ...item,
    details: [...item.details],
  }));
}

export async function getPortfolioContent() {
  noStore();

  const client = createSupabaseServerClient();

  if (!client) {
    return {
      skills: fallbackSkills,
      projects: fallbackProjects,
      blogCards: fallbackBlogCards,
      events: fallbackEvents,
      education: toFallbackEducation(fallbackEducation),
      technologies: fallbackTechnologies,
      source: "local-fallback" as const,
    };
  }

  const [skillsResult, projectsResult, blogCardsResult, eventsResult] =
    await Promise.all([
      client.from("skills").select("id,name,category").order("sort_order"),
      client
        .from("projects")
        .select("id,title,description,href,stack")
        .order("sort_order"),
      client
        .from("blog_cards")
        .select("id,title,href,cover_image_url,size_class")
        .order("sort_order"),
      client
        .from("events")
        .select("id,title,description,image_url,date")
        .order("sort_order"),
    ]);

  return {
    skills: skillsResult.error
      ? fallbackSkills
      : (skillsResult.data?.map((row: SupabaseSkillRow) => ({
          id: String(row.id),
          name: row.name,
          category: row.category,
        })) ?? fallbackSkills),
    projects: projectsResult.error
      ? fallbackProjects
      : (projectsResult.data?.map((row: SupabaseProjectRow) => ({
          id: String(row.id),
          title: row.title,
          description: row.description,
          href: row.href,
          stack: normalizeStack(row.stack),
        })) ?? fallbackProjects),
    blogCards: blogCardsResult.error
      ? fallbackBlogCards
      : (blogCardsResult.data?.map(
          (row: SupabaseBlogCardRow, index: number) => ({
            id: String(row.id),
            title: row.title,
            href: row.href,
            image: row.cover_image_url || "",
            sizeClass:
              row.size_class ||
              ["h-72", "h-56", "h-80", "h-64", "h-52"][index % 5],
          }),
        ) ?? fallbackBlogCards),
    events: eventsResult.error
      ? fallbackEvents
      : (eventsResult.data?.map((row: SupabaseEventRow) => ({
          id: String(row.id),
          title: row.title,
          description: row.description,
          image: row.image_url || "",
          date: row.date || "",
        })) ?? fallbackEvents),
    education: toFallbackEducation(fallbackEducation),
    technologies: fallbackTechnologies,
    source: (
      skillsResult.error ||
      projectsResult.error ||
      blogCardsResult.error ||
      eventsResult.error
        ? "local-fallback" as const
        : "supabase" as const
    ),
  };
}
