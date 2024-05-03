const express = require('express')
require('dotenv').config()
const Person = require('./models/person')
const morgan = require('morgan');
const cors  = require('cors');
const { default: next } = require('next');

const app = express()
app.use(express.static('dist'))

app.use(cors())

const errorHandler = (error, request, response, next) =>{
    console.log(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error:'malformatted id'})
    }else if(error.name==='ValidatonError'){
        return response.status(400).send({error:error.mesasge})
    }

    next(error)
}

app.use(express.json())
morgan.token('custom',(req, res) => JSON.stringify({name:req.body.name, number:req.body.number}))
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :custom'));

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknownEndpoint'})
}
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons=>{
        response.json(persons)
    })
})
app.get('/api/info', (request, response) =>{
    Person.countDocuments({}).then(count=>{
        response.send(`Phonebook has info of  ${count} contacts <br> ${new Date()}`)
    })
    .catch(error=> next(error))
})

app.get('/api/persons/:id', (request, response, next) =>{
    Person.findById(request.params.id)
    .then(person =>{
        if(person){
            response.json(person)
        }else{
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) =>{
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
        console.log(result)
    })
    .catch(error => next(error))

})

/* const generateId = () =>{
    return Math.floor(Math.random() * 100000)
} */
app.post('/api/persons', (req,res) =>{
    
    const body = req.body   
    if(body.name === undefined || body.number=== undefined) {
        return res.status(400).json({
            error:'content missing'
        })
        }
        const person = new Person({
            name: body.name,
            number: body.number,
        })

        person.save().then(result => {
            res.json(result)
        })

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    if(!body.name || !body.number){
        return response.status(404).json({error: 'Name or number missing'})
    }
    const person = {
        name: body.name,
        number: body.number,
    }
    Person.findByIdAndUpdate(request.params.id, person, {new:true})
      .then(updatedPerson => {
        if(updatedPerson){
            response.json(updatedPerson)
        }
        else{
            response.status(404).json({error:'Person not Found'})
        }
    })
      .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)
    
  
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})