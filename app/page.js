"use client";

import { useEffect, useState } from "react";
import NoteItem from "./components/NoteItem";
import "./notes.css";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes whenever notes change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Check if note already exists
  useEffect(() => {
    if (title.trim() === "") return;

    const existingNote = notes.find(
      (note) =>
        note.title.toLowerCase() === title.trim().toLowerCase() &&
        note.id !== editingId
    );

    if (existingNote) {
      console.log("A note with this title already exists.");
    }
  }, [title, notes, editingId]);

  // Add or update note
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please enter both title and description.");
      return;
    }

    if (editingId) {
      setNotes(
        notes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title: title.trim(),
                description: description.trim(),
              }
            : note
        )
      );

      setEditingId(null);
    } else {
      const existingNote = notes.some(
        (note) =>
          note.title.toLowerCase() === title.trim().toLowerCase()
      );

      if (existingNote) {
        alert("A note with this title already exists.");
        return;
      }

      const newNote = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
      };

      setNotes([...notes, newNote]);
    }

    setTitle("");
    setDescription("");
  };

  // Edit note
  const handleEdit = (note) => {
    setTitle(note.title);
    setDescription(note.description);
    setEditingId(note.id);
  };

  // Delete note
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (confirmDelete) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setEditingId(null);
  };

  return (
    <main className="container">
      <header className="header">
        <div>
          <h1>My Notes</h1>
          <p>Keep your thoughts organized and easy to find.</p>
        </div>
      </header>

      <section className="note-form-section">
        <h2>{editingId ? "Update Note" : "Create a Note"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>

            <input
              id="title"
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              placeholder="Write your note..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-btn">
              {editingId ? "Update Note" : "Add Note"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="notes-section">
        <div className="section-header">
          <h2>My Notes</h2>
          <span>{notes.length} notes</span>
        </div>

        {notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No notes yet</h3>
            <p>Create your first note using the form above.</p>
          </div>
        ) : (
          <div className="notes-list">
            {notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}