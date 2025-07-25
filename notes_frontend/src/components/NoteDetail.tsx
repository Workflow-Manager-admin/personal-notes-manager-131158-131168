import React, { useState, useEffect } from "react";
import type { Note } from "./NotesList";

interface Props {
  note: Note | null;
  onSave: (title: string, content: string) => Promise<void>;
  onDelete: () => Promise<void>;
  loading: boolean;
  isNew?: boolean;
}

const NoteDetail: React.FC<Props> = ({
  note,
  onSave,
  onDelete,
  loading,
  isNew = false,
}) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [edited, setEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setEdited(false);
    setError(null);
  }, [note?.id, note?.title, note?.content]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(title, content);
      setEdited(false);
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "message" in e) {
        setError((e as { message?: string }).message || "Failed to save note.");
      } else {
        setError("Failed to save note.");
      }
    }
    setSaving(false);
  };

  if (!note && !isNew) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 select-none">
        Select a note to view or edit.
      </div>
    );
  }

  return (
    <section className="flex-1 flex flex-col items-stretch p-8 bg-[var(--background)] min-w-0">
      <input
        className="mb-4 border-b-2 border-[#1976d2] outline-none bg-transparent text-xl font-bold px-2 py-1 focus:bg-[#f1f8ff] dark:focus:bg-[#112232] transition"
        placeholder="Title"
        value={title}
        onChange={e => {
          setTitle(e.target.value);
          setEdited(true);
        }}
        disabled={loading || saving}
      />
      <textarea
        rows={12}
        className="border border-gray-200 rounded-md px-3 py-2 resize-none bg-white dark:bg-[#232323] text-base mb-6 font-mono focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition"
        placeholder="Write your note here..."
        value={content}
        onChange={e => {
          setContent(e.target.value);
          setEdited(true);
        }}
        disabled={loading || saving}
        style={{ minHeight: 260 }}
      />
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="flex gap-3 mt-auto mb-1">
        <button
          className="bg-[#1976d2] text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-[#1565c0] transition shadow-md"
          disabled={!edited || saving || loading}
          onClick={handleSave}
        >
          {saving ? "Saving..." : isNew ? "Create" : "Save"}
        </button>
        {!isNew && (
          <button
            className="bg-[#e53935] text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-[#b71c1c] transition"
            onClick={onDelete}
            disabled={loading || saving}
          >
            Delete
          </button>
        )}
      </div>
    </section>
  );
};

export default NoteDetail;
