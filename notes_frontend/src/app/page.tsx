"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import NotesList, { Note } from "@/components/NotesList";
import NoteDetail from "@/components/NoteDetail";
import Fab from "@/components/Fab";

const NotesHome: React.FC = () => {
  const { user, loading: userLoading } = useAuth();
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // CRUD
  async function fetchNotes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user?.id ?? "INVALID")
      .order("updated_at", { ascending: false });
    setLoading(false);
    if (!error) {
      setNotes(data as Note[]);
      // Auto-select the first if nothing
      if (!selectedId && data.length > 0) setSelectedId(data[0].id);
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotes();
    } else if (!userLoading) {
      router.replace("/auth");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userLoading]);

  // Filter notes for the search bar
  const filteredNotes = searchValue.trim()
    ? notes.filter(n =>
        n.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
        n.content?.toLowerCase().includes(searchValue.toLowerCase())
      )
    : notes;

  // Get selected note in list
  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  // Create new
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNote = async (title: string, content: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .insert([{ title, content, user_id: user?.id }])
      .select()
      .single();
    setLoading(false);
    if (!error && data) {
      setIsCreating(false);
      setNotes((prev) => [data as Note, ...prev]);
      setSelectedId(data.id);
    }
    if (error) throw new Error(error.message);
  };

  // Update
  const handleUpdateNote = async (title: string, content: string) => {
    if (!selectedNote) return;
    setLoading(true);
    const { error } = await supabase
      .from("notes")
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq("id", selectedNote.id);
    setLoading(false);
    if (!error) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === selectedNote.id ? { ...n, title, content, updated_at: new Date().toISOString() } : n
        )
      );
    }
    if (error) throw new Error(error.message);
  };

  // Delete
  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    setLoading(true);
    const { error } = await supabase.from("notes").delete().eq("id", selectedNote.id);
    setLoading(false);
    if (!error) {
      setNotes((prev) => prev.filter((n) => n.id !== selectedNote.id));
      setSelectedId((prev) => {
        const idx = notes.findIndex((n) => n.id === prev);
        return notes[idx + 1]?.id || notes[idx - 1]?.id || null;
      });
    }
    if (error) throw new Error(error.message);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="animate-pulse">Loading ...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Navbar />
      <main className="flex flex-1 min-h-0">
        <NotesList
          notes={filteredNotes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <div className="flex-1 min-w-0 border-l border-gray-200 bg-[var(--background)] relative">
          {isCreating ? (
            <NoteDetail
              note={{ id: "", title: "", content: "", created_at: "", updated_at: "" }}
              onSave={handleCreateNote}
              onDelete={async () => {
                setIsCreating(false);
              }}
              loading={loading}
              isNew
            />
          ) : (
            <NoteDetail
              note={selectedNote}
              onSave={handleUpdateNote}
              onDelete={handleDeleteNote}
              loading={loading}
            />
          )}
        </div>
      </main>
      <Fab
        onClick={() => {
          setIsCreating(true);
          setSelectedId(null);
        }}
      />
    </div>
  );
};

export default NotesHome;
