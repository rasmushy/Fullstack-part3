const mongoose = require('mongoose')
const Person = require('./models/person')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
// adding person to the database with extra arguments
const personName = process.argv[3]
const personNumber = process.argv[4]
const password = process.argv[2]

const url =  `mongodb+srv://rehude:${password}@cluster0.bh77vdw.mongodb.net/FullstackPersonApp?retryWrites=true&w=majority`

mongoose.connect(url)

//const generateId = () => {
//  const maxId = Math.floor(Math.random() * 10000000);
//  return maxId;
//};

//let persons = [
//  {
//    id: 1,
//    name: "Arto Hellas",
//    number: "040-1234567",
//  },
//  {
//   id: 2,
//    name: "Ada Lovelace",
//    number: "39-44-5323523",
//  },
//  {
//    id: 3,
//    name: "Dan Abramov",
//    number: "12-43-234345",
//  },
//  {
//    id: 4,
//    name: "Mary Poppendick",
//    number: "39-23-6423122",
//  },
//];
//

//  if (Person.find((person) => person.name === name))
//  return res.status(400).json({
//    error: "Name must be unique",
// })

//const unknownEndpoint = (req, res) => {
//  res.status(404).send({error: "unknown endpoint"});
//};
//
//app.use(unknownEndpoint);

//if (error.message === "unknown endpoint") {
//  res.status(404).send({error: "unknown endpoint"});
//}

// //janky way, mby figure here some better way :D
// const dbLength = Person.find({}).then((persons) => {
//   persons.map((person) => person);
// }).length;

const personObj = new Person({
  name: personName,
  number: personNumber,
})

if(!personName || !personNumber) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
}else{
  // eslint-disable-next-line no-unused-vars
  personObj.save().then(result => {
    console.log(personObj)
    console.log(`added ${personObj.name} number ${personObj.number} to phonebook`)
    mongoose.connection.close()
  })
}





