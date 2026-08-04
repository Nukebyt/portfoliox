"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import type { BlogCard, EventCard, Project, Skill, Certificate } from "@/lib/content";
import { publicSettings } from "@/lib/public-settings";

type AdminContent = {
  skills: Skill[];
  projects: Project[];
  blogCards: BlogCard[];
  events: EventCard[];
  certificates: Certificate[];
};

type CollectionName = keyof AdminContent;

type AdminDashboardProps = AdminContent & {
  source: "supabase" | "local-fallback";
};

function makeSkill(): Skill {
  return { id: crypto.randomUUID(), name: "", category: "" };
}

function makeProject(): Project {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    href: "",
    stack: [],
  };
}

function makeBlogCard(): BlogCard {
  return {
    id: crypto.randomUUID(),
    title: "",
    href: "",
    image: "",
    sizeClass: "h-72",
  };
}

function makeEvent(): EventCard {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    image: "",
    date: "",
  };
}

function makeCertificate(): Certificate {
  return {
    id: crypto.randomUUID(),
    title: "",
    issuer: "",
    date: "",
    description: "",
    certificateUrl: "",
  };
}

async function saveCollection<T extends CollectionName>(
  collection: T,
  items: AdminContent[T],
) {
  const response = await fetch("/api/admin/content", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ collection, items }),
  });

  const result = (await response.json()) as { ok: boolean; message?: string };

  if (!response.ok || !result.ok) {
    throw new Error(result.message || "Unable to save collection.");
  }
}

async function uploadImage(file: File, pathPrefix: string) {
  const formData = new FormData();
  formData.append("prefix", pathPrefix);
  formData.append("file", file);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const result = (await response.json()) as {
    ok: boolean;
    url?: string;
    message?: string;
  };

  if (!response.ok || !result.ok || !result.url) {
    throw new Error(result.message || "Unable to upload image.");
  }

  return result.url;
}

export function AdminDashboard({
  skills: initialSkills,
  projects: initialProjects,
  blogCards: initialBlogCards,
  events: initialEvents,
  certificates: initialCertificates,
  source,
}: AdminDashboardProps) {
  const router = useRouter();
  const [skills, setSkills] = useState(initialSkills);
  const [projects, setProjects] = useState(initialProjects);
  const [blogCards, setBlogCards] = useState(initialBlogCards);
  const [events, setEvents] = useState(initialEvents);
  const [certificates, setCertificates] = useState(initialCertificates);
  const [saving, setSaving] = useState<CollectionName | null>(null);
  const [message, setMessage] = useState<string>("");

  const canWrite = Boolean(
    publicSettings.supabaseUrl && publicSettings.supabaseAnonKey,
  );

  const statusText = useMemo(() => {
    if (!canWrite) {
      return "Read-only fallback is active until Supabase keys are configured.";
    }

    return source === "supabase"
      ? "Live Supabase content is active."
      : "Supabase is configured, but one or more tables fell back locally.";
  }, [canWrite, source]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    window.localStorage.setItem("theme", "dark");
  }, []);

  async function handleSave<T extends CollectionName>(
    collection: T,
    items: AdminContent[T],
  ) {
    setSaving(collection);
    setMessage("");

    try {
      await saveCollection(collection, items);
      setMessage(`${collection} saved successfully.`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save.");
    } finally {
      setSaving(null);
    }
  }

  async function handleImageChange(
    collection: "blogCards" | "events" | "certificates",
    index: number,
    file: File | null,
  ) {
    if (!file) {
      return;
    }

    setMessage("Uploading image...");

    try {
      const url = await uploadImage(file, collection);

      let updatedItems: AdminContent[typeof collection];

      if (collection === "blogCards") {
        const next = blogCards.map((item, itemIndex) =>
          itemIndex === index ? { ...item, image: url } : item,
        );
        setBlogCards(next);
        updatedItems = next;
      } else if (collection === "events") {
        const next = events.map((item, itemIndex) =>
          itemIndex === index ? { ...item, image: url } : item,
        );
        setEvents(next);
        updatedItems = next;
      } else {
        const next = certificates.map((item, itemIndex) =>
          itemIndex === index ? { ...item, certificateUrl: url } : item,
        );
        setCertificates(next);
        updatedItems = next;
      }

      setMessage("Image uploaded. Saving...");

      try {
        await saveCollection(collection, updatedItems);
        setMessage("Image uploaded and saved.");
        router.refresh();
      } catch (saveError) {
        setMessage(
          `Image uploaded but save failed: ${saveError instanceof Error ? saveError.message : "Unknown error"}. Click Save to retry.`,
        );
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  return (
    <div className="mt-10 space-y-8">
      <div className="soft-card rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-(--color-accent)">
              Dashboard status
            </p>
            <p className="mt-2 text-sm text-muted">{statusText}</p>
          </div>
          <div className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted">
            Storage bucket: {publicSettings.supabaseStorageBucket}
          </div>
        </div>
        {message ? (
          <p className="mt-4 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted">
            {message}
          </p>
        ) : null}
      </div>

      <CollectionEditor
        title="Skills"
        description="Editable skill list rendered on the homepage."
        items={skills}
        setItems={setSkills}
        onAdd={() => setSkills((current) => [...current, makeSkill()])}
        onSave={() => handleSave("skills", skills)}
        saving={saving === "skills"}
        canWrite={canWrite}
        renderRow={(item, index, updateItem, removeItem) => (
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={item.name}
              onChange={(event) =>
                updateItem(index, "name", event.target.value)
              }
              placeholder="Skill name"
              className="rounded-2xl border border-border bg-surface px-4 py-3"
            />
            <input
              value={item.category}
              onChange={(event) =>
                updateItem(index, "category", event.target.value)
              }
              placeholder="Category"
              className="rounded-2xl border border-border bg-surface px-4 py-3"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-full border border-border px-4 py-3 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      />

      <CollectionEditor
        title="Projects"
        description="Project cards with stack, link, and summary text."
        items={projects}
        setItems={setProjects}
        onAdd={() => setProjects((current) => [...current, makeProject()])}
        onSave={() => handleSave("projects", projects)}
        saving={saving === "projects"}
        canWrite={canWrite}
        renderRow={(item, index, updateItem, removeItem) => (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <input
                value={item.title}
                onChange={(event) =>
                  updateItem(index, "title", event.target.value)
                }
                placeholder="Project title"
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              />
              <input
                value={item.href}
                onChange={(event) =>
                  updateItem(index, "href", event.target.value)
                }
                placeholder="Project link"
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              />
            </div>
            <textarea
              value={item.description}
              onChange={(event) =>
                updateItem(index, "description", event.target.value)
              }
              rows={4}
              placeholder="Project description"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3"
            />
            <input
              value={item.stack.join(", ")}
              onChange={(event) =>
                updateItem(
                  index,
                  "stack",
                  event.target.value
                    .split(",")
                    .map((entry) => entry.trim())
                    .filter(Boolean),
                )
              }
              placeholder="Stack items separated by commas"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-full border border-border px-4 py-3 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      />

      <CollectionEditor
        title="Blog cards"
        description="Cards with Blogspot URL, title, and a storage-backed image."
        items={blogCards}
        setItems={setBlogCards}
        onAdd={() => setBlogCards((current) => [...current, makeBlogCard()])}
        onSave={() => handleSave("blogCards", blogCards)}
        saving={saving === "blogCards"}
        canWrite={canWrite}
        renderRow={(item, index, updateItem, removeItem) => (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <input
                value={item.title}
                onChange={(event) =>
                  updateItem(index, "title", event.target.value)
                }
                placeholder="Card title"
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              />
              <input
                value={item.href}
                onChange={(event) =>
                  updateItem(index, "href", event.target.value)
                }
                placeholder="Blogspot URL"
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <input
                value={item.image}
                onChange={(event) =>
                  updateItem(index, "image", event.target.value)
                }
                placeholder="Image URL or Supabase storage URL"
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleImageChange(
                    "blogCards",
                    index,
                    event.target.files?.[0] || null,
                  )
                }
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              />
            </div>
            <input
              value={item.sizeClass}
              onChange={(event) =>
                updateItem(index, "sizeClass", event.target.value)
              }
              placeholder="Size class like h-72"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-full border border-border px-4 py-3 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      />

      <CollectionEditor
        title="Events"
        description="Attended events with image, date, and summary text."
        items={events}
        setItems={setEvents}
        onAdd={() => setEvents((current) => [...current, makeEvent()])}
        onSave={() => handleSave("events", events)}
        saving={saving === "events"}
        canWrite={canWrite}
        renderRow={(item, index, updateItem, removeItem) => (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <input
                value={item.title}
                onChange={(event) =>
                  updateItem(index, "title", event.target.value)
                }
                placeholder="Event title"
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              />
              <input
                value={item.date}
                onChange={(event) =>
                  updateItem(index, "date", event.target.value)
                }
                placeholder="Event date"
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              />
            </div>
            <textarea
              value={item.description}
              onChange={(event) =>
                updateItem(index, "description", event.target.value)
              }
              rows={4}
              placeholder="Event description"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3"
            />
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <input
                value={item.image}
                onChange={(event) =>
                  updateItem(index, "image", event.target.value)
                }
                placeholder="Image URL or Supabase storage URL"
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleImageChange(
                    "events",
                    index,
                    event.target.files?.[0] || null,
                  )
                }
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-full border border-border px-4 py-3 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      />

      <CollectionEditor
        title="Certificates"
        description="Issued certificates with file link, issuer, date, and optional description."
        items={certificates}
        setItems={setCertificates}
        onAdd={() => setCertificates((current) => [...current, makeCertificate()])}
        onSave={() => handleSave("certificates", certificates)}
        saving={saving === "certificates"}
        canWrite={canWrite}
        renderRow={(item, index, updateItem, removeItem) => (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <input
                value={item.title}
                onChange={(event) =>
                  updateItem(index, "title", event.target.value)
                }
                placeholder="Certificate title"
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              />
              <input
                value={item.issuer}
                onChange={(event) =>
                  updateItem(index, "issuer", event.target.value)
                }
                placeholder="Issuer"
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              />
            </div>
            <input
              value={item.date}
              onChange={(event) => updateItem(index, "date", event.target.value)}
              placeholder="Date or duration"
              className="rounded-2xl border border-border bg-surface px-4 py-3"
            />
            <textarea
              value={item.description}
              onChange={(event) =>
                updateItem(index, "description", event.target.value)
              }
              rows={4}
              placeholder="Description (optional)"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3"
            />
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <input
                value={(item as any).certificateUrl || (item as any).certificate_url || ""}
                onChange={(event) =>
                  updateItem(index, "certificateUrl" as any, event.target.value as any)
                }
                placeholder="Certificate URL or Supabase storage URL"
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleImageChange(
                    "certificates",
                    index,
                    event.target.files?.[0] || null,
                  )
                }
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-full border border-border px-4 py-3 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      />

      <div className="soft-card rounded-3xl p-6 text-sm leading-7 text-muted">
        Formspree endpoint: {publicSettings.formspreeAction}
      </div>
    </div>
  );
}

function CollectionEditor<T extends { id: string }>({
  title,
  description,
  items,
  setItems,
  onAdd,
  onSave,
  saving,
  canWrite,
  renderRow,
}: {
  title: string;
  description: string;
  items: T[];
  setItems: Dispatch<SetStateAction<T[]>>;
  onAdd: () => void;
  onSave: () => void;
  saving: boolean;
  canWrite: boolean;
  renderRow: (
    item: T,
    index: number,
    updateItem: <K extends keyof T>(index: number, key: K, value: T[K]) => void,
    removeItem: (index: number) => void,
  ) => ReactNode;
}) {
  function updateItem<K extends keyof T>(index: number, key: K, value: T[K]) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  }

  function removeItem(index: number) {
    setItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  return (
    <section className="soft-card rounded-3xl p-6">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
      </div>

      <div className="mt-6 space-y-5">
        {items.map((item, index) => (
          <Fragment key={item.id}>
            {renderRow(item, index, updateItem, removeItem)}
          </Fragment>
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-border/60 pt-6">
        <button
          type="button"
          onClick={onAdd}
          disabled={!canWrite}
          className="rounded-full border border-border px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add {title.slice(0, -1).toLowerCase()}
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!canWrite || saving}
          className="rounded-full bg-(--color-accent) px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : `Save ${title.toLowerCase()}`}
        </button>
      </div>
    </section>
  );
}
