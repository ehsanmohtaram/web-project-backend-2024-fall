const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(express.json()); 
app.use(cors());

let users = [];
let questions = [];
let seeds = [];

app.get('/questions', (req, res) => {
    res.json(questions);
});

app.post('/question', (req, res) => {
    const newQuestion = {
        id: questions.length + 1,
        ask: req.body.ask,
        choices: req.body.choices,
        answer: req.body.answer,
        seed: req.body.seed
    };
    questions.push(newQuestion);
    res.status(201).json(newQuestion);
});

app.get('/seeds', (req, res) => {
    res.json(seeds);
});

app.post('/seed', (req, res) => {
    const newSeed = {
        id: seeds.length + 1, // Simple ID assignment
        name: req.body.name
    };
    seeds.push(newSeed);
    res.status(201).json(newSeed);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});