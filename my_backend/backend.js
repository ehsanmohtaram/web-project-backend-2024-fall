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
let currentUser = ""

function getQuestionById (id) {
    for (let q in questions) {
        if (questions[q].id == id){
            return questions[q];
        }
    }
    return null;
}

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
    if (!answered_questions.hasOwnProperty(username)) return questions;
    s = []
    l = 0
    for (let q in questions) {
        if (!answered_questions[username].includes(questions[q].id)){
            s[l] = questions[q];
            l++;
        }
    }
    return s;
}

function updateTable(username, correctAnswer) {
    for (let u in users) {
        if (users[u].username == username) {
            users[u].totalAnswer += 1;
            if (correctAnswer) users[u].correctAnswer += 1;
            users[u].score = users[u].correctAnswer * 5 - users[u].totalAnswer;
        }
    }
}

function addSeed(seedName) {
    const newSeed = {
        id: seeds.length + 1, // Simple ID assignment
        name: seedName
    };
    seeds.push(newSeed);
    return newSeed;
}

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/addUser', (req, res) => {
    const newUser = {
        id: users.length + 1,
        username: req.body.username,
        password: req.body.password,
        totalAnswer: 0,
        correctAnswer: 0,
        score: 0
    };
    x = 0;
    for (let i in users){
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
            answered_questions[newUser.username] = []
            res.status(201).json("new user created");
        }
    }
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
            x = 1;
            if(users[i].password == newUser.password){
                res.status(201).json("you are logged in");
                currentUser = newUser.username;
            } else{
                res.status(201).json("password is wrong!");
            }
            break;
        }
    }
    if (x == 0){
        res.status(201).json("username not found!");
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
    doesExist = false
    for (let s in seeds){
        if (seeds[s].name == newQuestion.seed) {
            doesExist = true
            break;
        }
    }
    if (!doesExist) addSeed(newQuestion.seed);
    questions.push(newQuestion);
    res.status(201).json(newQuestion);
});

app.get('/notAnswered', (req, res) => { 
    notAnswered = getNotAnsweredQuestions(currentUser);
    res.json(notAnswered);
});

app.post('/answer', (req, res) => {
    if (currentUser != ""){
        q = getQuestionById(req.body.questionId)
        a = q.choices[req.body.answer - 1];
        correctness = (a == q.answer);
        updateTable(currentUser, correctness);
        answered_questions[currentUser].push(req.body.questionId);
        res.status(201);
    }
});


app.get('/seeds', (req, res) => {
    seeds_to_return = []
    for (let s in seeds) {
        seedName = seeds[s].name;
        q = getQuestionsBySeed(seedName);
        seeds_to_return.push({
            "name" : seedName, 
            "questions" : q
        });
    }
    res.json(seeds_to_return);
});

app.post('/seed', (req, res) => {
    let newSeed = addSeed(req.body.name);
    res.status(201).json(newSeed);
});

app.get('/scores', (req, res) => {
    scores = []
    for (let u in users) {
        scores.push({
            "name" : users[u].username, 
            "answeredQuestions" : users[u].totalAnswer,
            "correctAnswers" : users[u].correctAnswer,
            "score": users[u].score
        });
    }
    res.json(scores);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});