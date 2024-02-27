const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/favicon.ico', (req, res) => res.status(204));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
  try {
    const notesData = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8');
    const notes = JSON.parse(notesData);
    res.json(notes);
  } catch (error) {
    console.error('Error reading notes:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/notes', (req, res) => {
  try {
    const newNote = req.body;
    const notesData = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8');
    const notes = JSON.parse(notesData);

    // Generate a unique ID for the new note (you may use npm package like uuid)
    newNote.id = generateUniqueId();

    notes.push(newNote);
    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));
    res.json(newNote);
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Bonus: Delete Route
app.delete('/api/notes/:id', (req, res) => {
  try {
    const noteId = req.params.id;
    let notesData = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8');
    let notes = JSON.parse(notesData);

    // Filter out the note with the given id
    notes = notes.filter((note) => note.id !== noteId);

    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// Function to generate unique ID
function generateUniqueId() {
  // Implement your logic to generate a unique ID
}
