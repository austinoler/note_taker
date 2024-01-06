const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static middleware for serving static files 
app.use(express.static('public'));

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
  });
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // API Routes
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    res.json(notes);
  });
  
  app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  
    // Generate a unique ID for the new note (you may use npm package like uuid)
    newNote.id = generateUniqueId(); 
  
    notes.push(newNote);
  
    fs.writeFileSync('db.json', JSON.stringify(notes));
  
    res.json(newNote);
  });
  