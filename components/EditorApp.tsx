"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import {
  defaultContent,
  type Photo,
  type Project,
  type ResumeEntry,
  type SiteContent,
  type SocialLink,
  type Video,
} from "@/lib/content";

type ArrayKey = "socials" | "projects" | "photos" | "videos" | "experience" | "education";

const newItems: Record<ArrayKey, SocialLink | Project | Photo | Video | ResumeEntry> = {
  socials: { label: "New link", url: "" },
  projects: { title: "New project", year: "2026", description: "", url: "" },
  photos: { title: "Untitled", caption: "", url: "" },
  videos: { title: "New video", year: "2026", url: "" },
  experience: { title: "Role", organization: "Organization", period: "", description: "" },
  education: { title: "Program", organization: "Institution", period: "", description: "" },
};

export function EditorApp({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);
  const [state, setState] = useState("All published changes are live");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");

  useEffect(() => {
    const draft = window.localStorage.getItem("portfolio-editor-draft");
    if (!draft) return;
    try {
      setContent(JSON.parse(draft));
      setState("Draft restored from this browser");
    } catch {
      window.localStorage.removeItem("portfolio-editor-draft");
    }
  }, []);

  function updateField(key: keyof SiteContent, value: string) {
    setContent((current) => ({ ...current, [key]: value }));
    setState("Unpublished changes");
  }

  function updateItem(
    key: ArrayKey,
    index: number,
    field: string,
    value: string,
  ) {
    setContent((current) => ({
      ...current,
      [key]: current[key].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
    setState("Unpublished changes");
  }

  function addItem(key: ArrayKey) {
    setContent((current) => ({
      ...current,
      [key]: [...current[key], { ...newItems[key] }],
    }));
    setState("Unpublished changes");
  }

  function removeItem(key: ArrayKey, index: number) {
    setContent((current) => ({
      ...current,
      [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
    }));
    setState("Unpublished changes");
  }

  function saveDraft() {
    window.localStorage.setItem("portfolio-editor-draft", JSON.stringify(content));
    setState("Draft saved in this browser");
  }

  async function publish() {
    setSaving(true);
    setState("Publishing…");
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const result = (await response.json()) as {
        content?: SiteContent;
        error?: string;
      };
      if (!response.ok) throw new Error(result.error || "Could not publish");
      if (result.content) setContent(result.content);
      window.localStorage.removeItem("portfolio-editor-draft");
      setState("Published — your live site is updated");
    } catch (error) {
      setState(error instanceof Error ? error.message : "Could not publish");
    } finally {
      setSaving(false);
    }
  }

  async function uploadPhoto(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(`photo-${index}`);
    setState("Uploading image…");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/media", { method: "POST", body });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) {
        throw new Error(result.error || "Upload failed");
      }
      updateItem("photos", index, "url", result.url);
      setState("Image uploaded — publish to make it live");
    } catch (error) {
      setState(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading("");
    }
  }

  function resetDraft() {
    setContent(defaultContent);
    setState("Starter content restored — not yet published");
  }

  return (
    <main className="editor-shell">
      <header className="editor-topbar">
        <div className="editor-brand">
          <strong>Site editor</strong>
          <span className="save-state">{state}</span>
        </div>
        <div className="editor-actions">
          <a className="editor-button" href="/" target="_blank">
            View site ↗
          </a>
          <button className="editor-button" type="button" onClick={saveDraft}>
            Save draft
          </button>
          <button
            className="editor-button primary"
            type="button"
            onClick={publish}
            disabled={saving}
          >
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </header>

      <div className="editor-workspace">
        <section className="editor-panel">
          <div className="editor-intro">
            <h1>Make it yours.</h1>
            <p>
              Edit the fields below and watch the preview update. Save a private
              draft whenever you like; Publish sends the changes to the live site.
            </p>
          </div>

          <EditorSection title="Identity">
            <TextField label="Your name" value={content.name} onChange={(v) => updateField("name", v)} />
            <TextField label="Small introduction" value={content.eyebrow} onChange={(v) => updateField("eyebrow", v)} />
            <TextArea label="Main headline" value={content.headline} onChange={(v) => updateField("headline", v)} />
            <TextArea label="Short introduction" value={content.intro} onChange={(v) => updateField("intro", v)} />
            <div className="field-row">
              <TextField label="Location" value={content.location} onChange={(v) => updateField("location", v)} />
              <TextField label="Availability" value={content.availability} onChange={(v) => updateField("availability", v)} />
            </div>
            <TextArea label="About" value={content.about} onChange={(v) => updateField("about", v)} />
            <TextField label="Email" value={content.email} onChange={(v) => updateField("email", v)} />
          </EditorSection>

          <RepeatSection title="Social links" onAdd={() => addItem("socials")}>
            {content.socials.map((item, index) => (
              <RepeatCard key={`social-${index}`} onRemove={() => removeItem("socials", index)}>
                <div className="field-row">
                  <TextField label="Label" value={item.label} onChange={(v) => updateItem("socials", index, "label", v)} />
                  <TextField label="URL" value={item.url} onChange={(v) => updateItem("socials", index, "url", v)} />
                </div>
              </RepeatCard>
            ))}
          </RepeatSection>

          <RepeatSection title="Projects" onAdd={() => addItem("projects")}>
            {content.projects.map((item, index) => (
              <RepeatCard key={`project-${index}`} onRemove={() => removeItem("projects", index)}>
                <div className="field-row">
                  <TextField label="Title" value={item.title} onChange={(v) => updateItem("projects", index, "title", v)} />
                  <TextField label="Year" value={item.year} onChange={(v) => updateItem("projects", index, "year", v)} />
                </div>
                <TextArea label="Description" value={item.description} onChange={(v) => updateItem("projects", index, "description", v)} />
                <TextField label="Project URL" value={item.url} onChange={(v) => updateItem("projects", index, "url", v)} />
              </RepeatCard>
            ))}
          </RepeatSection>

          <RepeatSection title="Photo gallery" onAdd={() => addItem("photos")}>
            {content.photos.map((item, index) => (
              <RepeatCard key={`photo-${index}`} onRemove={() => removeItem("photos", index)}>
                <div className="field-row">
                  <TextField label="Title / alt text" value={item.title} onChange={(v) => updateItem("photos", index, "title", v)} />
                  <TextField label="Caption" value={item.caption} onChange={(v) => updateItem("photos", index, "caption", v)} />
                </div>
                <TextField label="Image URL" value={item.url} onChange={(v) => updateItem("photos", index, "url", v)} />
                <div className="upload-row">
                  <span className="editor-notice">URL or direct upload</span>
                  <label className="file-label">
                    {uploading === `photo-${index}` ? "Uploading…" : "Upload image"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(event) => uploadPhoto(index, event)}
                      disabled={Boolean(uploading)}
                    />
                  </label>
                </div>
              </RepeatCard>
            ))}
          </RepeatSection>

          <RepeatSection title="Videos" onAdd={() => addItem("videos")}>
            {content.videos.map((item, index) => (
              <RepeatCard key={`video-${index}`} onRemove={() => removeItem("videos", index)}>
                <div className="field-row">
                  <TextField label="Title" value={item.title} onChange={(v) => updateItem("videos", index, "title", v)} />
                  <TextField label="Year" value={item.year} onChange={(v) => updateItem("videos", index, "year", v)} />
                </div>
                <TextField label="YouTube or Vimeo URL" value={item.url} onChange={(v) => updateItem("videos", index, "url", v)} />
              </RepeatCard>
            ))}
          </RepeatSection>

          <EditorSection title="Résumé introduction">
            <TextArea label="Professional summary" value={content.resumeSummary} onChange={(v) => updateField("resumeSummary", v)} />
            <TextField label="Résumé PDF URL" value={content.resumeUrl} onChange={(v) => updateField("resumeUrl", v)} />
          </EditorSection>

          <ResumeEditor
            title="Experience"
            entries={content.experience}
            arrayKey="experience"
            onAdd={() => addItem("experience")}
            updateItem={updateItem}
            removeItem={removeItem}
          />
          <ResumeEditor
            title="Education"
            entries={content.education}
            arrayKey="education"
            onAdd={() => addItem("education")}
            updateItem={updateItem}
            removeItem={removeItem}
          />

          <section className="editor-section">
            <button className="tiny-button" type="button" onClick={resetDraft}>
              Restore example content
            </button>
          </section>
        </section>

        <aside className="preview-panel">
          <div className="preview-chrome">
            <span><span className="preview-dot" />Live preview</span>
            <span>Home</span>
          </div>
          <div className="preview-canvas">
            <div className="preview-mini-header">
              <strong>{content.name || "Your name"}</strong>
              <div className="preview-mini-nav">
                <span>Index</span>
                <span>Projects</span>
                <span>Photos</span>
                <span>Videos</span>
                <span>Résumé</span>
              </div>
              <span>◐</span>
            </div>
            <section className="preview-mini-hero">
              <p>{content.eyebrow}</p>
              <h2>{content.headline || "Your headline"}</h2>
              <p>{content.intro}</p>
            </section>
            <div className="preview-mini-projects">
              {content.projects.slice(0, 4).map((project, index) => (
                <div className="preview-mini-project" key={`preview-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.title}</span>
                  <span>{project.year}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function EditorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="editor-section">
      <div className="editor-section-header"><h2>{title}</h2></div>
      {children}
    </section>
  );
}

function RepeatSection({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="editor-section">
      <div className="editor-section-header">
        <h2>{title}</h2>
        <button className="tiny-button" type="button" onClick={onAdd}>+ Add</button>
      </div>
      {children}
    </section>
  );
}

function RepeatCard({ onRemove, children }: { onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="repeat-card">
      {children}
      <div className="upload-row">
        <span />
        <button className="tiny-button" type="button" onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="field">
      <label>
        {label}
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      </label>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="field">
      <label>
        {label}
        <textarea value={value} onChange={(event) => onChange(event.target.value)} />
      </label>
    </div>
  );
}

function ResumeEditor({
  title,
  entries,
  arrayKey,
  onAdd,
  updateItem,
  removeItem,
}: {
  title: string;
  entries: ResumeEntry[];
  arrayKey: "experience" | "education";
  onAdd: () => void;
  updateItem: (key: ArrayKey, index: number, field: string, value: string) => void;
  removeItem: (key: ArrayKey, index: number) => void;
}) {
  return (
    <RepeatSection title={title} onAdd={onAdd}>
      {entries.map((item, index) => (
        <RepeatCard key={`${arrayKey}-${index}`} onRemove={() => removeItem(arrayKey, index)}>
          <div className="field-row">
            <TextField label="Role / program" value={item.title} onChange={(v) => updateItem(arrayKey, index, "title", v)} />
            <TextField label="Organization" value={item.organization} onChange={(v) => updateItem(arrayKey, index, "organization", v)} />
          </div>
          <TextField label="Dates" value={item.period} onChange={(v) => updateItem(arrayKey, index, "period", v)} />
          <TextArea label="Description" value={item.description} onChange={(v) => updateItem(arrayKey, index, "description", v)} />
        </RepeatCard>
      ))}
    </RepeatSection>
  );
}
