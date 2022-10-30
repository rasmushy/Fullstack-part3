const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
const app = express();

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(express.json());
app.use(cors())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
app.use(express.static('build'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-1234567",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

app.use(express.json());

/* replaced with morgan
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}

app.use(requestLogger)
*/

const generateId = () => {
  const maxId = persons.length > 0 ? Math.floor(Math.random() * 10000000) : 0;
  return maxId;
};

//POST http://localhost:3001/api/persons/ HTTP/1.1
app.post("/api/persons", (req, res) => {
  const {name, number} = req.body;
  console.log(req.body)

  //Check for possible missing elements or same person with same name
  if (!name || !number)
    return res.status(400).json({
      error: "Name or number missing",
    });

  if (persons.find((person) => person.name === name))
    return res.status(400).json({
      error: "Name must be unique",
    });

  const personObj = {
    name,
    number,
    id: generateId(),
  };  

  persons = persons.concat(personObj);
  res.json(personObj);
});

//DELETE http://localhost:3001/api/persons/4 HTTP/1.1
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})


//all persons route
app.get("/api/persons", (req, res) => {
  res.send(persons);
});

//person number route with id
app.get("/api/persons/:id", (req, res) => {
  let person = persons.find((person) => person.id === Number(req.params.id));

  if (!person) {
    //console.log("person 404");
    return res.status(404).end();
  }

  res.send(person);
});

//app info route
app.get("/info", (req, res) => {
  res.send(`<h1>Info</h1>
  <p>Phonebook has info for ${persons.length} people</p>
  <p>Received at ${new Date()}</p>`);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//port stuff
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})