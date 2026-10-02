"use client";

export default function NoteItem({ note, onEdit, onDelete }) {
  return (
    <div className="note-card">
      <div>
        <h3>{note.title}</h3>
        <p>{note.description}</p>
      </div>

      <div className="note-actions">
        <button onClick={() => onEdit(note)}>
          Edit
        </button>

        <button onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}