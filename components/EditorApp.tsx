"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import {
  defaultContent,
  tabIds,
  type Award,
  type Photo,
  type Project,
  type ResumeEntry,
  type SiteContent,
  type SocialLink,
  type TabId,
  type Video,
} from "@/lib/content";

type ArrayKey =
  | "socials"
  | "projects"
  | "photos"
  | "videos"
  | "experience"
  | "awards";

const newItems: Record<
  ArrayKey,
  SocialLink | Project | Photo | Video | ResumeEntry | Award
> = {
  socials: { label: "New link", url: "" },
  projects: { title: "New project", year: "", description: "", url: "" },
  photos: { title: "Untitled", caption: "", url: "" },
  videos: { title: "New video", year: "", url: "" },
  experience: {
    title: "Role",
    organization: "Organization",
    period: "",
    description: "",
  },
  awards: { title: "Award", year: "", description: "", details: "" },
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
      const parsed = JSON.parse(draft) as Partial<SiteContent>;
      if (parsed.designVersion !== 7) {
        window.localStorage.removeItem("portfolio-editor-draft");
        return;
      }
      setContent(parsed as SiteContent);
      setState("Draft restored from this browser");
    } catch {
      window.localStorage.removeItem("portfolio-editor-draft");
    }
  }, []);

  function markChanged() {
    setState("Unpublished changes");
  }

  function updateText(
    key: "name" | "greeting" | "bio" | "email",
    value: string,
  ) {
    setContent((current) => ({ ...current, [key]: value }));
    markChanged();
  }

  function updateDefaultTab(value: TabId) {
    setContent((current) => ({ ...current, defaultTab: value }));
    markChanged();
  }

  function updateFact(index: number, value: string) {
    setContent((current) => ({
      ...current,
      facts: current.facts.map((fact, factIndex) =>
        factIndex === index ? value : fact,
      ),
    }));
    markChanged();
  }

  function addFact() {
    setContent((current) => ({
      ...current,
      facts: [...current.facts, "new fun fact"],
    }));
    markChanged();
  }

  function removeFact(index: number) {
    setContent((current) => ({
      ...current,
      facts: current.facts.filter((_, factIndex) => factIndex !== index),
    }));
    markChanged();
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
    markChanged();
  }

  function addItem(key: ArrayKey) {
    setContent((current) => ({
      ...current,
      [key]: [...current[key], { ...newItems[key] }],
    }));
    markChanged();
  }

  function removeItem(key: ArrayKey, index: number) {
    setContent((current) => ({
      ...current,
      [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
    }));
    markChanged();
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

  return (
    <main className="editor-shell">
      <header className="editor-topbar">
        <div className="editor-brand">
          <strong>site editor</strong>
          <span className="save-state">{state}</span>
        </div>
        <div className="editor-actions">
          <a className="editor-button" href="/" target="_blank">
            view site ↗
          </a>
          <button className="editor-button" type="button" onClick={saveDraft}>
            save draft
          </button>
          <button
            className="editor-button primary"
            type="button"
            onClick={publish}
            disabled={saving}
          >
            {saving ? "publishing…" : "publish"}
          </button>
        </div>
      </header>

      <div className="editor-workspace">
        <section className="editor-panel">
          <div className="editor-intro">
            <h1>edit your index.</h1>
            <p>
              The left side controls your introduction. Add material to the
              sections whenever it is ready; empty sections stay deliberately quiet.
            </p>
          </div>

          <EditorSection title="introduction">
            <TextField
              label="name"
              value={content.name}
              onChange={(value) => updateText("name", value)}
            />
            <TextField
              label="small header"
              value={content.greeting}
              onChange={(value) => updateText("greeting", value)}
            />
            <TextArea
              label="bio"
              value={content.bio}
              onChange={(value) => updateText("bio", value)}
            />
            <TextField
              label="email"
              value={content.email}
              onChange={(value) => updateText("email", value)}
            />
            <SelectField
              label="default section"
              value={content.defaultTab}
              onChange={updateDefaultTab}
            />
          </EditorSection>

          <RepeatSection title="fun facts" onAdd={addFact}>
            {content.facts.map((fact, index) => (
              <RepeatCard key={`fact-${index}`} onRemove={() => removeFact(index)}>
                <TextField
                  label={`fact ${index + 1}`}
                  value={fact}
                  onChange={(value) => updateFact(index, value)}
                />
              </RepeatCard>
            ))}
          </RepeatSection>

          <RepeatSection title="social links" onAdd={() => addItem("socials")}>
            {content.socials.map((item, index) => (
              <RepeatCard
                key={`social-${index}`}
                onRemove={() => removeItem("socials", index)}
              >
                <div className="field-row">
                  <TextField
                    label="platform"
                    value={item.label}
                    onChange={(value) =>
                      updateItem("socials", index, "label", value)
                    }
                  />
                  <TextField
                    label="url"
                    value={item.url}
                    onChange={(value) =>
                      updateItem("socials", index, "url", value)
                    }
                  />
                </div>
              </RepeatCard>
            ))}
          </RepeatSection>

          <ExperienceEditor
            entries={content.experience}
            onAdd={() => addItem("experience")}
            updateItem={updateItem}
            removeItem={removeItem}
          />

          <RepeatSection title="projects" onAdd={() => addItem("projects")}>
            {content.projects.map((item, index) => (
              <RepeatCard
                key={`project-${index}`}
                onRemove={() => removeItem("projects", index)}
              >
                <div className="field-row">
                  <TextField
                    label="title"
                    value={item.title}
                    onChange={(value) =>
                      updateItem("projects", index, "title", value)
                    }
                  />
                  <TextField
                    label="year"
                    value={item.year}
                    onChange={(value) =>
                      updateItem("projects", index, "year", value)
                    }
                  />
                </div>
                <TextArea
                  label="description"
                  value={item.description}
                  onChange={(value) =>
                    updateItem("projects", index, "description", value)
                  }
                />
                <TextField
                  label="url"
                  value={item.url}
                  onChange={(value) =>
                    updateItem("projects", index, "url", value)
                  }
                />
              </RepeatCard>
            ))}
          </RepeatSection>

          <RepeatSection title="videos" onAdd={() => addItem("videos")}>
            {content.videos.map((item, index) => (
              <RepeatCard
                key={`video-${index}`}
                onRemove={() => removeItem("videos", index)}
              >
                <div className="field-row">
                  <TextField
                    label="title"
                    value={item.title}
                    onChange={(value) =>
                      updateItem("videos", index, "title", value)
                    }
                  />
                  <TextField
                    label="year"
                    value={item.year}
                    onChange={(value) =>
                      updateItem("videos", index, "year", value)
                    }
                  />
                </div>
                <TextField
                  label="youtube url"
                  value={item.url}
                  onChange={(value) =>
                    updateItem("videos", index, "url", value)
                  }
                />
              </RepeatCard>
            ))}
          </RepeatSection>

          <RepeatSection title="gallery" onAdd={() => addItem("photos")}>
            {content.photos.map((item, index) => (
              <RepeatCard
                key={`photo-${index}`}
                onRemove={() => removeItem("photos", index)}
              >
                <div className="field-row">
                  <TextField
                    label="title / alt text"
                    value={item.title}
                    onChange={(value) =>
                      updateItem("photos", index, "title", value)
                    }
                  />
                  <TextField
                    label="caption"
                    value={item.caption}
                    onChange={(value) =>
                      updateItem("photos", index, "caption", value)
                    }
                  />
                </div>
                <TextField
                  label="image url"
                  value={item.url}
                  onChange={(value) =>
                    updateItem("photos", index, "url", value)
                  }
                />
                <div className="upload-row">
                  <span className="editor-notice">url or direct upload</span>
                  <label className="file-label">
                    {uploading === `photo-${index}` ? "uploading…" : "upload image"}
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

          <RepeatSection title="awards" onAdd={() => addItem("awards")}>
            {content.awards.map((item, index) => (
              <RepeatCard
                key={`award-${index}`}
                onRemove={() => removeItem("awards", index)}
              >
                <div className="field-row">
                  <TextField
                    label="award"
                    value={item.title}
                    onChange={(value) =>
                      updateItem("awards", index, "title", value)
                    }
                  />
                  <TextField
                    label="year"
                    value={item.year}
                    onChange={(value) =>
                      updateItem("awards", index, "year", value)
                    }
                  />
                </div>
                <TextArea
                  label="description"
                  value={item.description}
                  onChange={(value) =>
                    updateItem("awards", index, "description", value)
                  }
                />
                <TextArea
                  label="additional results (optional)"
                  value={item.details}
                  onChange={(value) =>
                    updateItem("awards", index, "details", value)
                  }
                />
              </RepeatCard>
            ))}
          </RepeatSection>

          <section className="editor-section">
            <button
              className="tiny-button"
              type="button"
              onClick={() => {
                setContent(defaultContent);
                setState("Starter content restored — not yet published");
              }}
            >
              restore starter content
            </button>
          </section>
        </section>

        <aside className="preview-panel">
          <div className="preview-chrome">
            <span>
              <span className="preview-dot" />
              live preview
            </span>
            <span>{content.defaultTab}</span>
          </div>
          <div className="preview-canvas">
            <div className="preview-index">
              <section>
                <h2>{content.greeting || "hi there!"}</h2>
                <p>{content.bio}</p>
                <ul>
                  {content.facts.map((fact, index) => (
                    <li key={`preview-fact-${index}`}>- {fact}</li>
                  ))}
                </ul>
                <div className="preview-socials">@ &nbsp; ◎ &nbsp; ▶ &nbsp; in &nbsp; git</div>
              </section>
              <section className="preview-tabs">
                <nav>
                  {tabIds.map((tab) => (
                    <span key={tab}>
                      {content.defaultTab === tab ? "→" : "·"} {tab}
                    </span>
                  ))}
                </nav>
                <p>nothing here yet.</p>
              </section>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function EditorSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="editor-section">
      <div className="editor-section-header">
        <h2>{title}</h2>
      </div>
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
        <button className="tiny-button" type="button" onClick={onAdd}>
          + add
        </button>
      </div>
      {children}
    </section>
  );
}

function RepeatCard({
  onRemove,
  children,
}: {
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="repeat-card">
      {children}
      <div className="upload-row">
        <span />
        <button className="tiny-button" type="button" onClick={onRemove}>
          remove
        </button>
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
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: TabId;
  onChange: (value: TabId) => void;
}) {
  return (
    <div className="field">
      <label>
        {label}
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as TabId)}
        >
          {tabIds.map((tab) => (
            <option key={tab} value={tab}>
              {tab}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function ExperienceEditor({
  entries,
  onAdd,
  updateItem,
  removeItem,
}: {
  entries: ResumeEntry[];
  onAdd: () => void;
  updateItem: (
    key: ArrayKey,
    index: number,
    field: string,
    value: string,
  ) => void;
  removeItem: (key: ArrayKey, index: number) => void;
}) {
  return (
    <RepeatSection title="experience" onAdd={onAdd}>
      {entries.map((item, index) => (
        <RepeatCard
          key={`experience-${index}`}
          onRemove={() => removeItem("experience", index)}
        >
          <div className="field-row">
            <TextField
              label="role"
              value={item.title}
              onChange={(value) =>
                updateItem("experience", index, "title", value)
              }
            />
            <TextField
              label="organization"
              value={item.organization}
              onChange={(value) =>
                updateItem("experience", index, "organization", value)
              }
            />
          </div>
          <TextField
            label="dates"
            value={item.period}
            onChange={(value) =>
              updateItem("experience", index, "period", value)
            }
          />
          <TextArea
            label="description"
            value={item.description}
            onChange={(value) =>
              updateItem("experience", index, "description", value)
            }
          />
        </RepeatCard>
      ))}
    </RepeatSection>
  );
}
