require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(express.static("build"));
app.use(cors());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
app.use(express.json());

//all persons route
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

//person number route with id
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) res.json(person);
      else res.status(404).end();
    })
    .catch((error) => next(error));
});

// new person added
app.post("/api/persons", (req, res, next) => {
  const {name, number} = req.body;
  if (!name || !number) return next(new Error("Name or number missing"));
  new Person({name, number}).save().then((savedPerson) => res.json(savedPerson));
});

//delete person
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

//update person
app.put("/api/persons/:id", (req, res, next) => {
  const {name, number} = req.body;
  if (!name || !number) return next(new Error("Missing name or number"));

  Person.findByIdAndUpdate(req.params.id, {name, number}, {new: true, runValidators: true, context: "query"})
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

//app info route
app.get("/info", async (req, res) => {
  const dbLength = await Person.countDocuments({});
  res.send(`<h1>Info</h1>
  <p>Phonebook has info for ${dbLength} people</p>
  <p>Received at ${new Date()}</p>`);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: "unknown endpoint"});
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.message === "Name or number missing") {
    return res.status(400).send({error: "name or number missing"});
  }

  if (error.name === "CastError") {
    return res.status(400).send({error: "malformatted id"});
  }

  if (error.name === "ValidationError") {
    return res.status(400).send({error: error.message});
  }

  next(error);
};

app.use(errorHandler);

//port stuffi 3001/8080 process.env.PORT ||
const PORT = process.env.PORT; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
