const express = require('express');
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');
const PORT = process.env.PORT || 3001;
const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// GET route for HTML
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for notes.HTML

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/api/notes', function (req, res) {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      var jsonData = JSON.parse(data);
      console.log(jsonData);
      res.json(jsonData);
    });
  });

  app.post('/api/notes', function (req, res) {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error reading the database.");
        }

        const jsonData = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uniqid(); 

        jsonData.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error writing to the database.");
            }

            res.json(newNote);
        });
    });
});


// DELETE route for notes
app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id;
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error reading the database.");
      }
  
      let parsedData = JSON.parse(data);
      const filterData = parsedData.filter(note => note.id !== id);
  
      fs.writeFile('./db/db.json', JSON.stringify(filterData, null, 2), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error writing to the database.");
        }
  
        res.send(`Deleted note with id ${id}`);
      });
    });
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});