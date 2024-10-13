import { noteInput, addNoteBtn, notesContainer, searchInput, downloadCSV } from "./selectors.js";

// class

class Note {
  constructor(content = "", fixed = false) {
    this.id = Date.now();
    this.content = content;
    this.fixed = false;
  }
}

// funções

function addNote() {
  const noteList = getNotes();
  const note = new Note();
  note.id = Date.now();
  note.content = noteInput.value;

  noteInput.value = "";
  noteInput.focus();

  noteList.push(note);
  saveNotes(noteList);
  createNote(note.id, note.content, note.fixed);
}

function createNote(id, content, fixed) {
  const noteElement = document.createElement("div");
  noteElement.classList.add("note");

  const textArea = document.createElement("textarea");
  textArea.classList.add("note-content");
  textArea.name = "note-content";
  textArea.textContent = content;
  textArea.placeholder = "Adicione algum texto";

  textArea.addEventListener("input", () => {
    updateNote(id, textArea.value);
  });

  const pinIcon = document.createElement("i");
  pinIcon.classList.add("bi", "bi-pin");

  pinIcon.addEventListener("click", () => {
    toggleFixed(id);

    pinIcon.classList.toggle("bi-pin");
    pinIcon.classList.toggle("bi-pin-fill");
  });

  if (fixed) {
    pinIcon.classList.add("bi-pin-fill");
    pinIcon.classList.remove("bi-pin");
  }

  const trashIcon = document.createElement("i");
  trashIcon.classList.add("bi", "bi-trash3");
  trashIcon.addEventListener("click", () => {
    removeNote(id);
  });

  const copyIcon = document.createElement("i");
  copyIcon.classList.add("bi", "bi-copy");
  copyIcon.addEventListener("click", () => {
    duplicateNote(id);
  });

  noteElement.appendChild(textArea);
  noteElement.appendChild(pinIcon);
  noteElement.appendChild(trashIcon);
  noteElement.appendChild(copyIcon);

  notesContainer.appendChild(noteElement);
}

function renderNote() {
  const noteList = getNotes();

  cleanNotes();

  noteList.forEach((note) => {
    createNote(note.id, note.content, note.fixed);
  });
}

function saveNotes(noteList) {
  localStorage.setItem("notes", JSON.stringify(noteList));
}

function getNotes() {
  const noteList = JSON.parse(localStorage.getItem("notes")) || [];
  return noteList;
}

function toggleFixed(id) {
  const noteList = getNotes();

  const note = noteList.find((note) => note.id === id);
  note.fixed = !note.fixed;

  noteList.sort((note1, note2) => (note1.fixed > note2.fixed ? -1 : 1));

  saveNotes(noteList);
  renderNote();
}

function removeNote(id) {
  const noteList = getNotes();

  const noteIndex = noteList.findIndex((note) => note.id === id);
  noteList.splice(noteIndex, 1);

  saveNotes(noteList);
  renderNote();
}

function duplicateNote(id) {
  const noteList = getNotes();

  const note = noteList.find((note) => note.id === id);
  const newNote = new Note(note.content, note.fixed);

  noteList.push(newNote);

  saveNotes(noteList);
  renderNote();
}

function updateNote(id, content) {
  const noteList = getNotes();

  const note = noteList.find((note) => note.id === id);

  note.content = content;

  saveNotes(noteList);
}

function searchNote() {
  const noteFiltered = getNotes().filter((note) => note.content.includes(searchInput.value));

  cleanNotes();

  noteFiltered.forEach((note) => {
    createNote(note.id, note.content, note.fixed);
  });
}

function cleanNotes() {
  notesContainer.textContent = "";
}

function exportCSV() {
  const noteList = getNotes();

  const csvString = [["ID", "Conteúdo", "Fixado"], ...noteList.map((note) => [note.id, note.content, note.fixed])]
    .map((note) => note.join())
    .join("\n");

  const blob = new Blob([csvString], { type: "text/csv" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "notes.csv");

  a.click();
}
// eventos

addNoteBtn.addEventListener("click", addNote);

noteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addNote();
  }
});

searchInput.addEventListener("input", () => {
  if (searchInput.value) {
    searchNote();
  } else {
    renderNote();
  }
});

downloadCSV.addEventListener("click", () => {
  exportCSV();
});
renderNote();
