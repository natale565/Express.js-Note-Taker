const express = require('express');
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');
const PORT = 3001;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('Develop/public'));

// GET route for HTML
app.get('/'), (req, res =>
    res.sendFile(path.join(__dirname, 'Develop/public/index.html'))
);

// GET route for notes.HTML

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'Develop/public/notes.html'))
);

app.get("/api/notes", function (req, res) {
    fs.readFile("Develop/db/db.json", "utf8", (err, data) => {
      var jsonData = JSON.parse(data);
      console.log(jsonData);
      res.json(jsonData);
    });
  });

  app.post("/api/notes", function (req, res) {
    fs.readFile("Develop/db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error reading the database.");
        }

        const jsonData = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uniqid(); // Assign a unique id to the new note

        jsonData.push(newNote);

        fs.writeFile("Develop/db/db.json", JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error writing to the database.");
            }

            res.json(newNote);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});