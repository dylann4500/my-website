"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { WritingArticleView } from "@/components/WritingArticleView";
import {
  formatWritingDate,
  type WritingArticle,
  type WritingBlock,
  type WritingBlockType,
} from "@/lib/writing";

function blankBlock(type: WritingBlockType = "paragraph"): WritingBlock {
  return { id: crypto.randomUUID(), type, text: "", url: "", alt: "" };
}

function blankArticle(): WritingArticle {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    slug: "",
    title: "",
    writtenAt: now,
    blocks: [blankBlock()],
    published: false,
    createdAt: now,
    updatedAt: now,
  };
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.valueOf() - offset).toISOString().slice(0, 16);
}

export function WritingEditor() {
  const [articles, setArticles] = useState<WritingArticle[]>([]);
  const [selected, setSelected] = useState<WritingArticle | null>(null);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [saveState, setSaveState] = useState("Loading your writing…");
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState("");
  const selectedRef = useRef<WritingArticle | null>(null);
  const saveRef = useRef<(article: WritingArticle) => Promise<void>>(async () => {});

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    let active = true;
    fetch("/api/writing")
      .then(async (response) => {
        const result = (await response.json()) as {
          articles?: WritingArticle[];
          error?: string;
        };
        if (!response.ok) throw new Error(result.error || "Could not load writing");
        if (!active) return;
        const next = result.articles || [];
        setArticles(next);
        setSelected(next[0] || blankArticle());
        setSaveState(next.length ? "All changes saved" : "New private draft");
      })
      .catch((error) => {
        if (active) setSaveState(error instanceof Error ? error.message : "Could not load writing");
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!dirty || !selected) return;
    const timeout = window.setTimeout(() => void saveRef.current(selected), 1200);
    return () => window.clearTimeout(timeout);
  }, [dirty, selected]);

  function updateSelected(update: (article: WritingArticle) => WritingArticle) {
    setSelected((current) => current ? update(current) : current);
    setDirty(true);
    setSaveState("Unsaved changes");
  }

  async function save(article = selectedRef.current) {
    if (!article) return;
    setSaveState("Saving…");
    try {
      const response = await fetch("/api/writing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ article }),
      });
      const result = (await response.json()) as {
        article?: WritingArticle;
        error?: string;
      };
      if (!response.ok || !result.article) {
        throw new Error(result.error || "Could not save this piece");
      }
      const saved = result.article;
      setArticles((current) => {
        const exists = current.some((item) => item.id === saved.id);
        const next = exists
          ? current.map((item) => item.id === saved.id ? saved : item)
          : [saved, ...current];
        return next.sort((a, b) => b.writtenAt.localeCompare(a.writtenAt));
      });
      setSelected((current) => current?.id === saved.id
        ? { ...current, slug: saved.slug, createdAt: saved.createdAt, updatedAt: saved.updatedAt }
        : current);
      setDirty(false);
      setSaveState(saved.published
        ? "Saved and available on /writing"
        : "Saved as a private draft");
    } catch (error) {
      setSaveState(error instanceof Error ? error.message : "Could not save");
    }
  }

  useEffect(() => {
    saveRef.current = async (article) => save(article);
  });

  function chooseArticle(article: WritingArticle) {
    if (dirty && selectedRef.current) void save(selectedRef.current);
    setSelected(article);
    setDirty(false);
    setMode("edit");
    setSaveState(article.published ? "Ready for the public list" : "Private draft");
  }

  function createArticle() {
    if (dirty && selectedRef.current) void save(selectedRef.current);
    setSelected(blankArticle());
    setDirty(true);
    setMode("edit");
    setSaveState("New private draft");
  }

  function updateBlock(id: string, update: Partial<WritingBlock>) {
    updateSelected((article) => ({
      ...article,
      blocks: article.blocks.map((block) => block.id === id ? { ...block, ...update } : block),
    }));
  }

  function addBlock(type: WritingBlockType) {
    updateSelected((article) => ({ ...article, blocks: [...article.blocks, blankBlock(type)] }));
  }

  function removeBlock(id: string) {
    updateSelected((article) => ({
      ...article,
      blocks: article.blocks.length === 1
        ? [blankBlock()]
        : article.blocks.filter((block) => block.id !== id),
    }));
  }

  async function uploadImage(blockId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(blockId);
    setSaveState("Uploading image…");
    try {
      const chunkSize = 1280 * 1024;
      const parts = Math.ceil(file.size / chunkSize);
      const createResponse = await fetch("/api/media?action=create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentType: file.type, fileName: file.name, size: file.size, parts }),
      });
      const created = (await createResponse.json()) as { key?: string; uploadId?: string; error?: string };
      if (!createResponse.ok || !created.key || !created.uploadId) {
        throw new Error(created.error || "Upload could not be started");
      }
      for (let index = 0; index < parts; index += 1) {
        const response = await fetch(`/api/media?uploadId=${encodeURIComponent(created.uploadId)}&part=${index + 1}`, {
          method: "PUT",
          headers: { "content-type": "application/octet-stream" },
          body: file.slice(index * chunkSize, Math.min(file.size, (index + 1) * chunkSize)),
        });
        if (!response.ok) throw new Error("An upload piece failed");
      }
      const completeResponse = await fetch("/api/media?action=complete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          key: created.key,
          uploadId: created.uploadId,
          contentType: file.type,
          fileName: file.name,
          size: file.size,
          parts,
        }),
      });
      const completed = (await completeResponse.json()) as { url?: string; error?: string };
      if (!completeResponse.ok || !completed.url) throw new Error(completed.error || "Upload failed");
      updateBlock(blockId, { url: completed.url, alt: file.name.replace(/\.[^.]+$/, "") });
      setSaveState("Image uploaded");
    } catch (error) {
      setSaveState(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading("");
      event.target.value = "";
    }
  }

  async function deleteSelected() {
    const article = selectedRef.current;
    if (!article || !window.confirm(`Delete “${article.title || "Untitled"}”? This cannot be undone.`)) return;
    const response = await fetch(`/api/writing?id=${encodeURIComponent(article.id)}`, { method: "DELETE" });
    if (!response.ok) {
      setSaveState("Could not delete this piece");
      return;
    }
    const next = articles.filter((item) => item.id !== article.id);
    setArticles(next);
    setSelected(next[0] || blankArticle());
    setDirty(false);
    setSaveState("Piece deleted");
  }

  return (
    <main className="writing-editor-shell">
      <header className="writing-editor-topbar">
        <div className="writing-editor-topbar-left">
          <a href="/edit">← site editor</a>
          <span>{saveState}</span>
        </div>
        <div className="writing-editor-actions">
          <button type="button" aria-pressed={mode === "edit"} onClick={() => setMode("edit")}>edit</button>
          <button type="button" aria-pressed={mode === "preview"} onClick={() => setMode("preview")}>preview</button>
          <button className="writing-save-button" type="button" onClick={() => void save()} disabled={!selected}>save now</button>
        </div>
      </header>

      <div className="writing-editor-layout">
        <aside className="writing-drafts">
          <div className="writing-drafts-header">
            <strong>writing</strong>
            <button type="button" onClick={createArticle}>+ new</button>
          </div>
          <p className="writing-privacy-note">
            Only ready pieces appear at /writing. Anyone with the link can read them.
          </p>
          <nav aria-label="Writing drafts">
            {articles.map((article) => (
              <button
                type="button"
                className={selected?.id === article.id ? "selected" : ""}
                key={article.id}
                onClick={() => chooseArticle(article)}
              >
                <span>{article.title || "Untitled"}</span>
                <small>{formatWritingDate(article.writtenAt)}{article.published ? " · ready" : ""}</small>
              </button>
            ))}
          </nav>
        </aside>

        <section className="writing-page-stage">
          {!selected ? null : mode === "preview" ? (
            <div className="writing-preview-paper">
              <WritingArticleView article={selected} />
            </div>
          ) : (
            <div className="writing-paper">
              <input
                className="writing-title-input"
                value={selected.title}
                onChange={(event) => updateSelected((article) => ({ ...article, title: event.target.value }))}
                placeholder="Untitled"
                aria-label="Piece title"
              />
              <div className="writing-meta-fields">
                <label>
                  written
                  <input
                    type="datetime-local"
                    value={toDateTimeLocal(selected.writtenAt)}
                    onChange={(event) => updateSelected((article) => ({
                      ...article,
                      writtenAt: new Date(event.target.value).toISOString(),
                    }))}
                  />
                </label>
                <label className="writing-ready-toggle">
                  <input
                    type="checkbox"
                    checked={selected.published}
                    onChange={(event) => updateSelected((article) => ({ ...article, published: event.target.checked }))}
                  />
                  show on unlisted writing page
                </label>
              </div>

              <div className="writing-blocks">
                {selected.blocks.map((block) => (
                  <div className={`writing-block writing-block-${block.type}`} key={block.id}>
                    <div className="writing-block-controls">
                      <select
                        value={block.type}
                        onChange={(event) => updateBlock(block.id, { type: event.target.value as WritingBlockType })}
                        aria-label="Block style"
                      >
                        <option value="paragraph">text</option>
                        <option value="heading">heading</option>
                        <option value="subheading">subheading</option>
                        <option value="image">image</option>
                      </select>
                      <button type="button" onClick={() => removeBlock(block.id)} aria-label="Remove block">×</button>
                    </div>
                    {block.type === "image" ? (
                      <div className="writing-image-block">
                        {block.url ? <img src={block.url} alt={block.alt} /> : <div>horizontal image</div>}
                        <input
                          value={block.alt}
                          onChange={(event) => updateBlock(block.id, { alt: event.target.value })}
                          placeholder="caption / alt text (optional)"
                          aria-label="Image caption and alt text"
                        />
                        <label>
                          {uploading === block.id ? "uploading…" : block.url ? "replace image" : "upload image"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            disabled={Boolean(uploading)}
                            onChange={(event) => void uploadImage(block.id, event)}
                          />
                        </label>
                      </div>
                    ) : (
                      <textarea
                        value={block.text}
                        rows={block.type === "paragraph" ? 3 : 1}
                        onChange={(event) => updateBlock(block.id, { text: event.target.value })}
                        placeholder={block.type === "paragraph" ? "Start writing…" : block.type}
                        aria-label={block.type}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="writing-add-blocks" aria-label="Add content block">
                <button type="button" onClick={() => addBlock("paragraph")}>+ text</button>
                <button type="button" onClick={() => addBlock("heading")}>+ heading</button>
                <button type="button" onClick={() => addBlock("subheading")}>+ subheading</button>
                <button type="button" onClick={() => addBlock("image")}>+ image</button>
              </div>
              <button className="writing-delete" type="button" onClick={() => void deleteSelected()}>delete piece</button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
