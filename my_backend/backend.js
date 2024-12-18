const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(express.json()); 
app.use(cors());

let users = [];
let questions = [];
let seeds = [];
let answered_questions = {}

function getQuestionsBySeed(seedName) {
    s = []
    l = 0
    for (let q in questions) {
        if (questions[q].seed == seedName){
            s[l] = questions[q].ask;
            l++;
        }
    }
    return s;
}

function getNotAnsweredQuestions(username) {
    s = []
    l = 0
    s = []
    l = 0
    for (let q in questions) {
        if (!answered_questions[username].includes(questions[q].id)){
            s[l] = questions[q].ask;
            l++;
        }
    }
    return s;
}

function updateTable(username, correctAnswer) {
    for (let u in users) {
        if (users[u].name == username) {
            users[u].totalAnswer ++;
            if (correctAnswer) users[u].correctAnswer ++;
            users[u].score = users[u].correctAnswer * 5 - users[u].totalAnswer;
        }
    }
}

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/user', (req, res) => {
    const newUser = {
        id: users.length + 1,
        username: req.body.username,
        password: req.body.password,
    };
    x = 0;
    for (var i in users){
        if (users[i].username == newUser.username){
            res.status(201).json("this username already used!");
            x = 1;
            break;
        }
    }
    if (x == 0){
        if (newUser.username == "" || newUser.password == ""){
            res.status(201).json("username or password is empty");
        }
        else{
            users.push(newUser);
            res.status(201).json("new user created");
        }
    }
});


app.post('/addUser', (req, res) => {
    const newUser = {
        id: users.length + 1,
        username: req.body.username,
        password: req.body.password,
    };
    x = 0;
    for (var i in users){
        if (users[i].username == newUser.username){
            x = 1;
            if(users[i].password == newUser.password){
                res.status(201).json("you are log in");
            } else{
                res.status(201).json("password is wrong!");
            }
            break;
        }
        if (x == 0){
            res.status(201).json("username not found!");
        }
    }
});

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