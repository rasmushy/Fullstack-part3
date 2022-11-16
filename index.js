const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const morgan = require('morgan')
// eslint-disable-next-line no-unused-vars
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

//all persons route
app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => res.json(persons))
})

//person number route with id
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) res.json(person)
      else res.status(404).end()
    })
    .catch((error) => next(error))
})

// new person added
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body
  new Person({ name, number })
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => next(error)) //tää rivi puuttu xD
})

//delete person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error))
})

//update person
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

//app info route
app.get('/info', async (req, res) => {
  const dbLength = await Person.countDocuments({})
  res.send(`<h1>Info</h1>
  <p>Phonebook has info for ${dbLength} people</p>
  <p>Received at ${new Date()}</p>`)
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
