import React from "react";

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchValue: string;
  setSearchValue: (s: string) => void;
}

const NotesList: React.FC<Props> = ({
  notes,
  selectedId,
  onSelect,
  searchValue,
  setSearchValue,
}) => {
  return (
    <aside className="w-full max-w-xs border-r border-gray-200 h-full flex flex-col bg-[var(--background)]">
      <div className="p-4 border-b">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search notes..."
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1976d2] bg-white dark:bg-[#232323]"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-gray-400 px-4 py-8 text-center">No notes found.</p>
        ) : (
          <ul className="divide-y">
            {notes.map((note) => (
              <li
                key={note.id}
                className={`px-5 py-4 cursor-pointer select-none ${
                  note.id === selectedId
                    ? "bg-[#e3f2fd] dark:bg-[#102c44] font-semibold"
                    : "hover:bg-gray-100 dark:hover:bg-[#232323]"
                }`}
                onClick={() => onSelect(note.id)}
              >
                <div className="truncate text-base">{note.title || <span className="italic text-gray-400">Untitled</span>}</div>
                <div className="text-xs text-gray-500 truncate">
                  {new Date(note.updated_at || note.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default NotesList;
