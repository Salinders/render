const express = require('express')

const morgan = require('morgan');
const cors  = require('cors')

const app = express()

app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
morgan.token('custom',(req, res) => JSON.stringify({name:req.body.name, number:req.body.number}))
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :custom'));


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/api/info', (request, response) =>{
    response.send(`Phonebook has info of ${persons.length} contacts <br>${new Date()}`)
})

app.get('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()

})

const generateId = () =>{
    return Math.floor(Math.random() * 100000)
}
app.post('/api/persons', (req,res) =>{
    
    const body = req.body
    const repeat = persons.some(person => person.name === body.name)
   

    if(!body.name || !body.number) {
        return res.status(400).json({
            error:'content missing'
        })
    } else if(repeat){
        return res.status(400).json({
            error:'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person)
    res.json(person)
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})